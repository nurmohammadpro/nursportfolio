import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { QuoteData } from "@/app/lib/agency-types";

// PDF styles are NOT standard CSS. They use a specific subset.
const styles = StyleSheet.create({
  page: { padding: 40 },
  section: { margin: 10, padding: 10 },
  text: { fontSize: 12 },
});

export const InvoiceTemplate = ({
  quote,
  project,
}: {
  quote: QuoteData;
  project: any;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.text}>Invoice: {quote.subject}</Text>
        <Text style={styles.text}>Amount: ${quote.amount}</Text>
        <Text style={styles.text}>Project: {project?.title}</Text>
      </View>
    </Page>
  </Document>
);
