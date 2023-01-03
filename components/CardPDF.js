import {
  Document,
  Page,
  Text,
  Image,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    color: "black",
    flexDirection: "row",
  },
  viewer: {
    width: "900px",
    height: "506px",
  },
  image: {
    height: 512,
    width: 512,
  },
  text: {
    flex: 1,
    textAlign: "center",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
  },
});

// Create Document Component
export default function BasicDocument({ text, image }) {
  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page size={[512, 1024]} orientation="landscape" style={styles.page}>
          <View style={styles.text}>
            <Text>Made with love</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Image style={styles.image} src={image} />
          </View>
        </Page>
        <Page size={[512, 1024]} orientation="landscape" style={styles.page}>
          <View style={{ flex: 1 }}></View>
          <View style={styles.text}>
            <Text
              style={{
                margin: "48px",
              }}
            >
              {text}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
