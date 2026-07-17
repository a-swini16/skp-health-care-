import { StyleSheet } from '@react-pdf/renderer'

export const themeColors = {
  primary: '#0B4C7F', // Deep Medical Blue
  secondary: '#1A365D',
  text: {
    main: '#1e293b', // slate-800
    muted: '#64748b', // slate-500
    light: '#94a3b8' // slate-400
  },
  border: {
    main: '#e2e8f0', // slate-200
    dark: '#cbd5e1' // slate-300
  },
  alert: {
    critical: '#dc2626', // red-600
    high: '#ea580c', // orange-600
    low: '#2563eb' // blue-600
  },
  background: {
    muted: '#f8fafc', // slate-50
    header: '#f1f5f9' // slate-100
  }
}

export const themeFonts = {
  size: {
    xs: 7,
    sm: 9,
    base: 10,
    lg: 12,
    xl: 14,
    xxl: 18,
    xxxl: 24
  }
}

export const globalStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    paddingTop: 30,
    paddingBottom: 70, // Room for absolute footer
    paddingHorizontal: 40,
    color: themeColors.text.main,
  },
  // Container for repeating header on every page
  headerContainer: {
    marginBottom: 20,
  },
  // Typography
  title: {
    fontSize: themeFonts.size.xxxl,
    fontWeight: 'bold',
    color: themeColors.primary,
  },
  heading1: {
    fontSize: themeFonts.size.xl,
    fontWeight: 'bold',
    color: themeColors.secondary,
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  heading2: {
    fontSize: themeFonts.size.lg,
    fontWeight: 'bold',
    color: themeColors.primary,
    marginBottom: 4,
  },
  textBase: {
    fontSize: themeFonts.size.base,
    lineHeight: 1.4,
  },
  textSm: {
    fontSize: themeFonts.size.sm,
    lineHeight: 1.4,
  },
  textXs: {
    fontSize: themeFonts.size.xs,
    lineHeight: 1.4,
  },
  textMuted: {
    color: themeColors.text.muted,
  },
  textBold: {
    fontWeight: 'bold',
  },
  // Layout utilities
  flexRow: {
    flexDirection: 'row',
  },
  flexCol: {
    flexDirection: 'column',
  },
  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border.main,
    marginVertical: 10,
  },
  dividerThick: {
    borderBottomWidth: 2,
    borderBottomColor: themeColors.primary,
    marginVertical: 15,
  }
})
