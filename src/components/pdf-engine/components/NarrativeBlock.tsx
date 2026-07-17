import React from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'
import { themeColors, themeFonts } from '../styles/theme'

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: themeFonts.size.lg,
    fontWeight: 'bold',
    color: themeColors.primary,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border.main,
    paddingBottom: 4,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: themeFonts.size.base,
    color: themeColors.text.main,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 10,
  },
  bullet: {
    width: 15,
    fontSize: themeFonts.size.base,
    color: themeColors.primary,
  },
  bulletText: {
    flex: 1,
    fontSize: themeFonts.size.base,
    color: themeColors.text.main,
    lineHeight: 1.5,
  },
  observationTitle: {
    fontSize: themeFonts.size.base,
    fontWeight: 'bold',
    color: themeColors.secondary,
    marginTop: 10,
    marginBottom: 4,
  }
})

export function NarrativeBlock({ title, paragraphs, bullets, observations }: { 
  title: string, 
  paragraphs?: string[], 
  bullets?: string[],
  observations?: { title: string, text: string }[] 
}) {
  return (
    <View style={styles.container} wrap={true}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
      {paragraphs?.map((p, i) => (
        <Text key={`p-${i}`} style={styles.paragraph}>{p}</Text>
      ))}

      {bullets && bullets.length > 0 && (
        <View style={{ marginTop: 5, marginBottom: 5 }}>
          {bullets.map((b, i) => (
            <View key={`b-${i}`} style={styles.bulletPoint} wrap={false}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{b}</Text>
            </View>
          ))}
        </View>
      )}

      {observations?.map((obs, i) => (
        <View key={`obs-${i}`} wrap={false}>
          <Text style={styles.observationTitle}>{obs.title}:</Text>
          <Text style={styles.paragraph}>{obs.text}</Text>
        </View>
      ))}
    </View>
  )
}
