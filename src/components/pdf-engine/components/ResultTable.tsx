import React from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'
import { themeColors, themeFonts } from '../styles/theme'

const styles = StyleSheet.create({
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: themeColors.background.header,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: themeColors.border.main,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: themeFonts.size.xs,
    fontWeight: 'bold',
    color: themeColors.text.muted,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border.main,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  colTest: { width: '40%' },
  colResult: { width: '20%' },
  colUnit: { width: '15%' },
  colRef: { width: '25%' },
  
  textValue: {
    fontSize: themeFonts.size.sm,
    color: themeColors.text.main,
  },
  textValueBold: {
    fontSize: themeFonts.size.sm,
    fontWeight: 'bold',
    color: themeColors.text.main,
  },
  textCritical: {
    fontSize: themeFonts.size.sm,
    fontWeight: 'bold',
    color: themeColors.alert.critical,
  },
  testName: {
    fontSize: themeFonts.size.sm,
    fontWeight: 'bold',
    color: themeColors.primary,
    marginBottom: 2,
  },
  testMethod: {
    fontSize: themeFonts.size.xs,
    color: themeColors.text.light,
  },
  categoryTitle: {
    fontSize: themeFonts.size.lg,
    fontWeight: 'bold',
    color: themeColors.secondary,
    backgroundColor: themeColors.background.muted,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 15,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: themeColors.primary,
  }
})

export function ResultTable({ testItem, results, patientGender }: { testItem: any, results: Record<string, string>, patientGender: string }) {
  const isValueCritical = (param: any, val: string) => {
    if (!val || !param.is_numeric) return false;
    const numVal = Number(val)
    if (isNaN(numVal)) return false;
    if ((param.min_critical_value && numVal < param.min_critical_value) || 
        (param.max_critical_value && numVal > param.max_critical_value)) {
      return true
    }
    return false
  }

  const parameters = testItem.test?.parameters || []

  return (
    <View wrap={false} style={{ marginBottom: 15 }}>
      <Text style={styles.categoryTitle}>{testItem.test?.name}</Text>
      
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <View style={styles.colTest}><Text style={styles.headerText}>TEST DESCRIPTION</Text></View>
          <View style={styles.colResult}><Text style={styles.headerText}>RESULT</Text></View>
          <View style={styles.colUnit}><Text style={styles.headerText}>UNITS</Text></View>
          <View style={styles.colRef}><Text style={styles.headerText}>REFERENCE RANGE</Text></View>
        </View>

        {/* Table Rows */}
        {parameters.map((param: any) => {
          const val = results[param.id] || '-'
          const isCritical = isValueCritical(param, val)
          const refRange = patientGender === 'female' ? param.reference_range_female : param.reference_range_male

          return (
            <View key={param.id} style={styles.tableRow} wrap={false}>
              <View style={styles.colTest}>
                <Text style={styles.textValueBold}>{param.name}</Text>
                <Text style={styles.testMethod}>Method: Photometry</Text>
              </View>
              <View style={styles.colResult}>
                <Text style={isCritical ? styles.textCritical : styles.textValueBold}>
                  {val} {isCritical && '*'}
                </Text>
              </View>
              <View style={styles.colUnit}>
                <Text style={styles.textValue}>{param.unit || '-'}</Text>
              </View>
              <View style={styles.colRef}>
                <Text style={styles.textValue}>{refRange || '-'}</Text>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}
