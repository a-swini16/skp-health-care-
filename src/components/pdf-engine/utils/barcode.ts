import bwipjs from 'bwip-js'
import QRCode from 'qrcode'

/**
 * Generates a Data URI for a Code128 barcode.
 * Uses bwip-js which works in both Node and Browser.
 */
export async function generateBarcodeURI(text: string): Promise<string> {
  try {
    const canvas = document.createElement('canvas')
    bwipjs.toCanvas(canvas, {
      bcid: 'code128',
      text: text,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    })
    return canvas.toDataURL('image/png')
  } catch (e) {
    console.error('Barcode generation failed:', e)
    return ''
  }
}

/**
 * Generates a Data URI for a QR code.
 */
export async function generateQRCodeURI(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 150,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
  } catch (e) {
    console.error('QR code generation failed:', e)
    return ''
  }
}
