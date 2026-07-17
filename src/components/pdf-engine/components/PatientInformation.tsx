import React from 'react'
import { Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { themeColors, themeFonts, globalStyles } from '../styles/theme'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: themeColors.border.main,
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#ffffff'
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    gap: 4
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    width: 100,
    fontSize: themeFonts.size.xs,
    color: themeColors.text.muted,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    fontSize: themeFonts.size.sm,
    fontWeight: 'bold',
    color: themeColors.text.main,
  },
  patientName: {
    fontSize: themeFonts.size.lg,
    fontWeight: 'bold',
    color: themeColors.secondary,
    marginBottom: 4,
  },
  barcodeImage: {
    height: 30,
    width: 120,
    marginTop: 5,
    alignSelf: 'flex-start'
  }
})

export function PatientInformation({ sample, barcodeUri }: { sample: any, barcodeUri?: string }) {
  const patient = sample?.order?.patient || {}
  const doctor = sample?.order?.doctor || {}

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-'
    const date = new Date(isoString)
    return date.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    })
  }

  return (
    <View style={styles.container}>
      {/* Left Column */}
      <View style={[styles.column, { paddingRight: 10 }]}>
        <Text style={styles.patientName}>
          {patient.first_name} {patient.last_name}
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Age / Gender</Text>
          <Text style={styles.value}>
            {patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : '--'} Yrs / {patient.gender === 'male' ? 'Male' : 'Female'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Patient ID (UHID)</Text>
          <Text style={styles.value}>{patient.uhid}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile</Text>
          <Text style={styles.value}>{patient.phone || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{patient.address || 'N/A'}</Text>
        </View>
      </View>

      {/* Right Column */}
      <View style={[styles.column, { borderLeftWidth: 1, borderLeftColor: themeColors.border.main, paddingLeft: 15 }]}>
        <View style={styles.row}>
          <Text style={styles.label}>Registered On</Text>
          <Text style={styles.value}>{formatDate(sample.order?.created_at)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Collected On</Text>
          <Text style={styles.value}>{formatDate(sample.collected_at)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Reported On</Text>
          <Text style={styles.value}>{formatDate(new Date().toISOString())}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ref. Doctor</Text>
          <Text style={styles.value}>Dr. {doctor.name || 'Self'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sample Type</Text>
          <Text style={styles.value}>{sample.sample_type}</Text>
        </View>
        {barcodeUri ? (
          <Image src={barcodeUri} style={styles.barcodeImage} />
        ) : null}
      </View>
    </View>
  )
}
