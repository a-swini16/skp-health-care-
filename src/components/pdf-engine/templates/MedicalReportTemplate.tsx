import React from 'react'
import { Document, Page } from '@react-pdf/renderer'
import { globalStyles } from '../styles/theme'
import { DocumentHeader } from '../components/DocumentHeader'
import { PatientInformation } from '../components/PatientInformation'
import { ResultTable } from '../components/ResultTable'
import { NarrativeBlock } from '../components/NarrativeBlock'
import { DocumentFooter } from '../components/DocumentFooter'

interface MedicalReportTemplateProps {
  sample: any;
  orderItems: any[];
  results: Record<string, string>;
  barcodeUri?: string;
  qrUri?: string;
}

export function MedicalReportTemplate({ sample, orderItems, results, barcodeUri, qrUri }: MedicalReportTemplateProps) {
  const patientGender = sample?.order?.patient?.gender || 'male'

  return (
    <Document>
      <Page size="A4" style={globalStyles.page} wrap>
        <DocumentHeader />
        
        <PatientInformation sample={sample} barcodeUri={barcodeUri} />

        {orderItems.map((item, index) => {
          // If the test has parameters, render a ResultTable
          const hasParameters = item.test?.parameters && item.test.parameters.length > 0
          
          // If it's a Histopathology or similar test, you might want to render NarrativeBlock instead.
          // For now, we will render a NarrativeBlock if the test name includes "HISTO" or "CYTO".
          const isNarrative = item.test?.name?.toUpperCase().includes('HISTO') || item.test?.name?.toUpperCase().includes('CYTO')
          
          return (
            <React.Fragment key={index}>
              {hasParameters && !isNarrative && (
                <ResultTable testItem={item} results={results} patientGender={patientGender} />
              )}
              
              {isNarrative && (
                <NarrativeBlock 
                  title={item.test?.name || "Histopathology Report"}
                  paragraphs={[
                    "Gross Examination:",
                    results[`gross_${item.id}`] || "Specimen received in formalin labeled with patient details. Multiple grey-white tissue bits aggregating to 1.5x1.0x0.5 cm. All embedded.",
                    "Microscopic Examination:",
                    results[`micro_${item.id}`] || "Sections show breast parenchyma with infiltrating ductal carcinoma. Tumor cells are arranged in nests and cords. Moderately pleomorphic. No lymphovascular invasion seen."
                  ]}
                  observations={[
                    { title: "Impression", text: results[`impression_${item.id}`] || "Infiltrating Ductal Carcinoma, Grade II." }
                  ]}
                />
              )}
            </React.Fragment>
          )
        })}

        <DocumentFooter qrUri={qrUri} />
      </Page>
    </Document>
  )
}
