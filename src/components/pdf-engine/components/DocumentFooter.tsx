import React from 'react'
import { Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { themeColors, themeFonts } from '../styles/theme'

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
  },
  signatureBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  signatureBox: {
    alignItems: 'center',
    width: 150,
  },
  signImage: {
    height: 40,
    marginBottom: 5,
    opacity: 0 // Placeholder until we have actual signature images
  },
  signName: {
    fontSize: themeFonts.size.sm,
    fontWeight: 'bold',
    color: themeColors.primary,
  },
  signRole: {
    fontSize: themeFonts.size.xs,
    color: themeColors.text.muted,
  },
  qrCode: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: themeColors.primary,
    paddingTop: 8,
  },
  footerText: {
    fontSize: themeFonts.size.xs,
    color: themeColors.text.muted,
  },
  pageNumber: {
    fontSize: themeFonts.size.xs,
    color: themeColors.text.muted,
  }
})

export function DocumentFooter({ qrUri }: { qrUri?: string }) {
  return (
    <View style={styles.footerContainer} fixed>
      <View style={styles.signatureBlock}>
        <View style={styles.signatureBox}>
          {qrUri ? <Image src={qrUri} style={styles.qrCode} /> : null}
          <Text style={styles.signRole}>Scan to Verify Report</Text>
        </View>
        <View style={styles.signatureBox}>
          <Image src="/skp_logo.png" style={styles.signImage} />
          <Text style={styles.signName}>Dr. Alice Smith</Text>
          <Text style={styles.signRole}>Chief Pathologist</Text>
          <Text style={styles.signRole}>MD, Pathology</Text>
        </View>
        <View style={styles.signatureBox}>
          <Image src="/skp_logo.png" style={styles.signImage} />
          <Text style={styles.signName}>Dr. Robert Jones</Text>
          <Text style={styles.signRole}>Medical Director</Text>
          <Text style={styles.signRole}>MD, PhD</Text>
        </View>
      </View>
      
      <View style={styles.bottomBar}>
        <Text style={styles.footerText}>
          *** End of Report *** | Printed on: {new Date().toLocaleString()}
        </Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} />
      </View>
    </View>
  )
}
