import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  RetailcodeApiClient,
  RetailcodeApiError,
  TopupApiConfig,
  SubscriptionMode,
  resolveAccent,
  isValidMsisdn,
  isValidAmount,
} from '@tolucode/core';
import { useTopupConfig } from './hooks/useTopupConfig.js';
import { Header } from './components/Header.js';
import { FormField } from './components/FormField.js';
import { SelectField, SelectOption } from './components/SelectField.js';
import { Footer } from './components/Footer.js';

export interface TopupWidgetProps {
  publicKey: string;
  msisdn: string;
  baseUrl: string;
  theme?: { accent?: string };
  /**
   * When true, the widget renders inside a full-screen Modal so it overlays
   * the current screen and can be dismissed to return to the caller.
   * When false (default), the widget renders inline — mount it on a dedicated
   * navigation screen and call navigation.goBack() inside onClose.
   */
  modal?: boolean;
  onSuccess?: (result: { success: true }) => void;
  onClose?: (result: { closed: true }) => void;
}

export function TopupWidget({
  publicKey,
  msisdn,
  baseUrl,
  theme,
  modal = false,
  onSuccess,
  onClose,
}: TopupWidgetProps) {
  const inner = (
    <TopupWidgetInner
      publicKey={publicKey}
      msisdn={msisdn}
      baseUrl={baseUrl}
      theme={theme}
      onSuccess={onSuccess}
      onClose={onClose}
    />
  );

  if (modal) {
    return (
      <Modal
        visible
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => onClose?.({ closed: true })}
      >
        {inner}
      </Modal>
    );
  }

  return inner;
}

// Separated so hooks are always called at the top level of a component.
function TopupWidgetInner({
  publicKey,
  msisdn,
  baseUrl,
  theme,
  onSuccess,
  onClose,
}: Omit<TopupWidgetProps, 'modal'>) {
  const accent = resolveAccent(theme?.accent);
  const client = useMemo(
    () => new RetailcodeApiClient(baseUrl, publicKey),
    [baseUrl, publicKey],
  );

  const state = useTopupConfig(client, msisdn);

  if (!isValidMsisdn(msisdn)) {
    return <InitError message="Subscriber phone number is not valid." />;
  }
  if (state.status === 'loading') return <Spinner accent={accent} />;
  if (state.status === 'error')  return <InitError message={state.message} />;

  return (
    <SubscriptionForm
      cfg={state.cfg}
      msisdn={msisdn}
      accent={accent}
      client={client}
      onSuccess={onSuccess}
      onClose={onClose}
    />
  );
}

// ── Inner form (only rendered after config loads) ──────────────────────────

interface FormProps {
  cfg: TopupApiConfig;
  msisdn: string;
  accent: string;
  client: RetailcodeApiClient;
  onSuccess?: TopupWidgetProps['onSuccess'];
  onClose?: TopupWidgetProps['onClose'];
}

function SubscriptionForm({ cfg, msisdn, accent, client, onSuccess, onClose }: FormProps) {
  const {
    name: prefilledName = '',
    subscribedAirtime = false,
    subscribedData = false,
    airtimethresholds = {},
    airtimeMin = 0,
    airtimeMax = 10000,
    dataThresholds = {},
    dataPlans = [],
    terms = null,
  } = cfg;

  const isFullSubscriber    = subscribedAirtime && subscribedData;
  const isPartialSubscriber = (subscribedAirtime || subscribedData) && !isFullSubscriber;
  const isBrandNew          = !subscribedAirtime && !subscribedData;

  const [termsAccepted,  setTermsAccepted]  = useState(!isBrandNew || !terms);
  const [forceDep,       setForceDep]       = useState(false);
  const [name,           setName]           = useState(prefilledName);
  const [depMsisdn,      setDepMsisdn]      = useState('');
  const [mode,           setMode]           = useState<SubscriptionMode>('airtime');
  const [airtimeThresh,  setAirtimeThresh]  = useState('');
  const [airtimeAmount,  setAirtimeAmount]  = useState('');
  const [dataThresh,     setDataThresh]     = useState('');
  const [dataPlan,       setDataPlan]       = useState('');
  const [airtimeMax$,    setAirtimeMax$]    = useState('');
  const [dataMax$,       setDataMax$]       = useState('');
  const [submitting,     setSubmitting]     = useState(false);

  const isDep = isFullSubscriber || forceDep;

  // Show terms on first render for brand-new users
  React.useEffect(() => {
    if (!isBrandNew || !terms || termsAccepted) return;
    Alert.alert(
      'Terms & Conditions',
      typeof terms === 'string' ? terms : '',
      [
        {
          text: 'Decline',
          style: 'cancel',
          onPress: () => onClose?.({ closed: true }),
        },
        {
          text: 'I Agree & Continue',
          onPress: () => setTermsAccepted(true),
        },
      ],
      { cancelable: false },
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived title/desc ────────────────────────────────────────────────────
  const title    = isDep ? 'Add Dependent' : isPartialSubscriber ? 'Complete Profile' : 'Auto Topup Subscription';
  const subtitle = isDep
    ? 'Configure subscription for someone else'
    : isPartialSubscriber
    ? 'Finish your Auto Topup subscription'
    : 'Automate your airtime & data recharge';

  // ── Select options ────────────────────────────────────────────────────────
  const airtimeThreshOptions: SelectOption[] = Object.entries(airtimethresholds).map(([k, id]) => ({
    label: `Below ₦${k}`,
    value: id,
  }));
  const dataThreshOptions: SelectOption[] = Object.entries(dataThresholds).map(([k, id]) => ({
    label: `Below ${k}`,
    value: id,
  }));
  const dataPlanOptions: SelectOption[] = dataPlans.map(p => ({
    label: `${p.allowance} — ₦${p.price}`,
    value: p.productId,
  }));
  const modeOptions: SelectOption[] = [
    { label: 'Airtime Only', value: 'airtime' },
    { label: 'Data Only',    value: 'data' },
    { label: 'Both Airtime & Data', value: 'both' },
  ];

  const showAirtime = isDep ? mode !== 'data' : isPartialSubscriber ? !subscribedAirtime : mode !== 'data';
  const showData    = isDep ? mode !== 'airtime' : isPartialSubscriber ? !subscribedData : mode !== 'airtime';

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    const beneficiary = isDep ? depMsisdn : msisdn;

    if (showAirtime && !isValidAmount(airtimeAmount, airtimeMin, airtimeMax)) {
      Alert.alert('Invalid Amount', `Enter ₦${airtimeMin} – ₦${airtimeMax}.`);
      return;
    }
    if (isDep && !beneficiary.trim()) {
      Alert.alert('Wait!', 'Enter the dependent phone number.');
      return;
    }

    setSubmitting(true);
    const common = { network: 'MTN', msisdn: beneficiary, name };

    try {
      if (showAirtime) {
        await client.subscribeAirtime({
          ...common,
          airtimeThresholdId: airtimeThresh,
          airtimeTopupValue:  airtimeAmount,
          ...(isDep && { customerMsisdn: msisdn, monthlyMaximum: airtimeMax$ }),
        });
      }
      if (showData) {
        await client.subscribeData({
          ...common,
          dataThresholdId: dataThresh,
          dataTopupValue:  dataPlan,
          ...(isDep && { customerMsisdn: msisdn, monthlyMaximum: dataMax$ }),
        });
      }
      onSuccess?.({ success: true });
      Alert.alert('Subscription Active!', 'Your auto top-up is now enabled.', [
        { text: 'OK', onPress: () => onClose?.({ closed: true }) },
      ]);
    } catch (err) {
      Alert.alert('Oops!', err instanceof RetailcodeApiError ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }, [
    isDep, depMsisdn, msisdn, showAirtime, showData,
    airtimeAmount, airtimeMin, airtimeMax, name,
    airtimeThresh, airtimeMax$, dataThresh, dataPlan, dataMax$,
    client, onSuccess, onClose,
  ]);

  if (!termsAccepted) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView style={styles.card} contentContainerStyle={styles.cardContent} showsVerticalScrollIndicator={false}>

          <Header
            title={title}
            subtitle={subtitle}
            msisdn={msisdn}
            accent={accent}
            onClose={() => onClose?.({ closed: true })}
          />

          <View style={styles.content}>
            {/* Registration */}
            <SectionLabel>Registration Details</SectionLabel>
            <FormField
              label="Full Name"
              accent={accent}
              value={name}
              onChangeText={t => setName(t.replace(/[^a-zA-Z\s]/g, ''))}
              autoComplete="name"
            />
            {isDep && (
              <FormField
                label="Phone Number"
                accent={accent}
                value={depMsisdn}
                onChangeText={t => setDepMsisdn(t.replace(/\D/g, ''))}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            )}

            {/* Mode selector — hidden for partial subscribers */}
            {!isPartialSubscriber && (
              <>
                <SectionLabel>Subscription Type</SectionLabel>
                <SelectField
                  label="Automation Mode"
                  accent={accent}
                  options={modeOptions}
                  value={mode}
                  onChange={v => setMode(v as SubscriptionMode)}
                />
              </>
            )}

            <Divider />

            {/* Airtime setup */}
            {showAirtime && (
              <>
                <SectionLabel>Airtime Setup</SectionLabel>
                <SelectField
                  label="Recharge when"
                  accent={accent}
                  options={airtimeThreshOptions}
                  value={airtimeThresh}
                  onChange={setAirtimeThresh}
                />
                <FormField
                  label="Amount (₦)"
                  accent={accent}
                  value={airtimeAmount}
                  onChangeText={t => setAirtimeAmount(t.replace(/\D/g, ''))}
                  keyboardType="numeric"
                  hint={`₦${airtimeMin} – ₦${airtimeMax}`}
                />
              </>
            )}

            {/* Data setup */}
            {showData && (
              <>
                <SectionLabel>Data Setup</SectionLabel>
                <SelectField
                  label="Recharge when"
                  accent={accent}
                  options={dataThreshOptions}
                  value={dataThresh}
                  onChange={setDataThresh}
                />
                <SelectField
                  label="Select Plan"
                  accent={accent}
                  options={dataPlanOptions}
                  value={dataPlan}
                  onChange={setDataPlan}
                />
              </>
            )}

            {/* Dependent spending controls */}
            {isDep && (
              <>
                <Divider />
                <SectionLabel>Spending Controls</SectionLabel>
                {showAirtime && (
                  <FormField
                    label="Airtime Limit (₦)"
                    accent={accent}
                    value={airtimeMax$}
                    onChangeText={t => setAirtimeMax$(t.replace(/\D/g, ''))}
                    keyboardType="numeric"
                  />
                )}
                {showData && (
                  <FormField
                    label="Data Limit (₦)"
                    accent={accent}
                    value={dataMax$}
                    onChangeText={t => setDataMax$(t.replace(/\D/g, ''))}
                    keyboardType="numeric"
                  />
                )}
              </>
            )}

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: accent }, submitting && styles.submitDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.85}
            >
              <Text style={styles.submitText}>
                {submitting ? 'Processing…' : 'Activate Subscription'}
              </Text>
            </TouchableOpacity>

            {/* Switch to dependent flow */}
            {isPartialSubscriber && !forceDep && (
              <TouchableOpacity onPress={() => { setForceDep(true); setName(''); }} style={styles.depLink}>
                <Text style={styles.depLinkText}>
                  Or <Text style={[styles.depLinkAction, { color: accent }]}>add a dependent instead</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Footer />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Tiny shared sub-components ─────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Text style={sectionStyles.label}>{children}</Text>;
}

function Divider() {
  return <View style={sectionStyles.divider} />;
}

function Spinner({ accent }: { accent: string }) {
  return (
    <View style={[styles.safe, styles.center]}>
      <Text style={{ color: accent, fontSize: 13 }}>Loading…</Text>
    </View>
  );
}

function InitError({ message }: { message: string }) {
  return (
    <View style={errStyles.box}>
      <Text style={errStyles.title}>SDK failed to initialize</Text>
      <Text style={errStyles.msg}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: '#fff' },
  flex:           { flex: 1 },
  center:         { alignItems: 'center', justifyContent: 'center' },
  card:           { flex: 1 },
  cardContent:    { paddingBottom: 20 },
  content:        { paddingHorizontal: 20, paddingBottom: 16 },
  submitBtn: {
    height: 52, borderRadius: 6, alignItems: 'center', justifyContent: 'center',
    marginTop: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 4,
  },
  submitDisabled: { opacity: 0.5 },
  submitText:     { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.1 },
  depLink:        { marginTop: 12, alignItems: 'center' },
  depLinkText:    { fontSize: 13, color: '#9CA3AF' },
  depLinkAction:  { fontWeight: '600' },
});

const sectionStyles = StyleSheet.create({
  label:   { fontSize: 10, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.9, marginBottom: 10, marginTop: 4 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
});

const errStyles = StyleSheet.create({
  box:   { margin: 40, padding: 24, borderWidth: 1.5, borderColor: '#FCA5A5', backgroundColor: '#FEF2F2', borderRadius: 8 },
  title: { fontWeight: '700', fontSize: 15, color: '#991B1B', textAlign: 'center', marginBottom: 4 },
  msg:   { fontSize: 13, color: '#991B1B', textAlign: 'center', opacity: 0.8 },
});
