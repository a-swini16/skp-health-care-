import React from 'react'
import { Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { themeColors, themeFonts, globalStyles } from '../styles/theme'

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  logo: {
    width: 140,
  },
  labInfoContainer: {
    alignItems: 'flex-end',
    flexDirection: 'column',
    gap: 2,
  },
  labName: {
    fontSize: themeFonts.size.lg,
    fontWeight: 'bold',
    color: themeColors.primary,
  },
  labDetails: {
    fontSize: themeFonts.size.xs,
    color: themeColors.text.muted,
  },
  accreditation: {
    marginTop: 2,
    fontSize: themeFonts.size.xs,
    fontWeight: 'bold',
    color: themeColors.secondary,
  }
})

const getLogoUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/skp_logo.png`
  }
  return '/skp_logo.png'
}

export function DocumentHeader() {
  return (
    <View style={globalStyles.headerContainer} fixed>
      <View style={styles.headerContainer}>
        <View>
          <Image src={getLogoUrl()} style={styles.logo} />
        </View>
        <View style={styles.labInfoContainer}>
          <Text style={styles.labName}>SKP Healthcare</Text>
          <Text style={styles.labDetails}>123 Medical Hub, City Center, Metropolis - 400001</Text>
          <Text style={styles.labDetails}>Phone: +91 99999 88888 | Email: lab@skphealthcare.com</Text>
          <Text style={styles.labDetails}>Website: www.skphealthcare.com</Text>
          <Text style={styles.accreditation}>NABL Accredited | ISO 9001:2015 Certified</Text>
        </View>
      </View>
      <View style={globalStyles.dividerThick} />
    </View>
  )
}
