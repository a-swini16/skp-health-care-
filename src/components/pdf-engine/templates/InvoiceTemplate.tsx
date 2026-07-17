import React from 'react'
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { globalStyles, themeColors, themeFonts } from '../styles/theme'
import { DocumentHeader } from '../components/DocumentHeader'

const styles = StyleSheet.create({
  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  invoiceTitle: {
    fontSize: themeFonts.size.xxl,
    fontWeight: 'bold',
    color: themeColors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  patientBox: {
    borderWidth: 1,
    borderColor: themeColors.border.main,
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
  },
  col: { flex: 1, gap: 4 },
  row: { flexDirection: 'row' },
  label: { width: 90, fontSize: themeFonts.size.xs, color: themeColors.text.muted, fontWeight: 'bold' },
  val: { flex: 1, fontSize: themeFonts.size.sm, color: themeColors.text.main, fontWeight: 'bold' },
  
  table: { width: '100%', marginBottom: 20 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: themeColors.background.header,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: themeColors.border.main,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  th: { fontSize: themeFonts.size.sm, fontWeight: 'bold', color: themeColors.text.muted },
  tr: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border.main,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  td: { fontSize: themeFonts.size.sm, color: themeColors.text.main },
  tdBold: { fontSize: themeFonts.size.sm, fontWeight: 'bold', color: themeColors.text.main },
  
  colNo: { width: '10%' },
  colDesc: { width: '50%' },
  colQty: { width: '15%', textAlign: 'center' },
  colAmt: { width: '25%', textAlign: 'right' },

  summaryBox: {
    width: '40%',
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: themeColors.border.main,
    borderRadius: 4,
    padding: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: themeColors.border.main,
  },
  totalText: {
    fontSize: themeFonts.size.lg,
    fontWeight: 'bold',
    color: themeColors.primary,
  },
  qrCode: {
    width: 80,
    height: 80,
    position: 'absolute',
    bottom: 20,
    left: 40,
  },
  terms: {
    position: 'absolute',
    bottom: 110,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: themeColors.border.main,
    paddingTop: 10,
  },
  termsTitle: { fontSize: themeFonts.size.xs, fontWeight: 'bold', marginBottom: 4 },
  termsText: { fontSize: themeFonts.size.xs, color: themeColors.text.muted, marginBottom: 2 }
})

export function InvoiceTemplate({ order, items, qrUri }: { order: any, items: any[], qrUri?: string }) {
  const patient = order?.patient || {}
  
  return (
    <Document>
      <Page size="A4" style={globalStyles.page} wrap>
        <DocumentHeader />

        <View style={styles.titleSection}>
          <Text style={styles.invoiceTitle}>TAX INVOICE / RECEIPT</Text>
        </View>

        <View style={styles.patientBox}>
          <View style={styles.col}>
            <View style={styles.row}><Text style={styles.label}>Patient Name</Text><Text style={styles.val}>{patient.firstName} {patient.lastName}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Age / Gender</Text><Text style={styles.val}>{patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : '--'} Yrs / {patient.gender === 'male' ? 'Male' : 'Female'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>UHID</Text><Text style={styles.val}>{patient.uhid}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Mobile</Text><Text style={styles.val}>{patient.phone}</Text></View>
          </View>
          <View style={styles.col}>
            <View style={styles.row}><Text style={styles.label}>Invoice No</Text><Text style={styles.val}>{order.id.slice(0,8).toUpperCase()}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Date</Text><Text style={styles.val}>{new Date(order.createdAt).toLocaleString()}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Payment Mode</Text><Text style={styles.val}>{order.paymentStatus === 'paid' ? 'Credit Card / UPI' : 'Pending'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Ref Doctor</Text><Text style={styles.val}>Dr. Self</Text></View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.colNo}><Text style={styles.th}>S.NO</Text></View>
            <View style={styles.colDesc}><Text style={styles.th}>SERVICE DESCRIPTION</Text></View>
            <View style={styles.colQty}><Text style={styles.th}>QTY</Text></View>
            <View style={styles.colAmt}><Text style={styles.th}>AMOUNT (INR)</Text></View>
          </View>

          {items.map((item, i) => (
            <View key={item.id} style={styles.tr}>
              <View style={styles.colNo}><Text style={styles.td}>{i + 1}</Text></View>
              <View style={styles.colDesc}>
                <Text style={styles.tdBold}>{item.test?.name}</Text>
              </View>
              <View style={styles.colQty}><Text style={styles.td}>1</Text></View>
              <View style={styles.colAmt}><Text style={styles.tdBold}>₹ {item.price.toFixed(2)}</Text></View>
            </View>
          ))}
        </View>

        <View style={styles.summaryBox} wrap={false}>
          <View style={styles.summaryRow}>
            <Text style={styles.td}>Subtotal:</Text>
            <Text style={styles.td}>₹ {(order.totalAmount || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.td}>Discount:</Text>
            <Text style={styles.td}>₹ 0.00</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.tdBold}>NET AMOUNT:</Text>
            <Text style={styles.totalText}>₹ {(order.totalAmount || 0).toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.terms} fixed>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termsText}>1. This is a computer generated invoice and does not require a physical signature.</Text>
          <Text style={styles.termsText}>2. For any queries regarding this invoice, please contact our support desk.</Text>
        </View>

        {qrUri ? <Image src={qrUri} style={styles.qrCode} fixed /> : null}

      </Page>
    </Document>
  )
}
