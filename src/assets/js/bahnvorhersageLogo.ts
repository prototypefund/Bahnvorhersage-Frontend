export default function printLogo() {
  const styles = {
    lightGrey: 'color: #e5e5e5;',
    lightGreyBgBlack: 'color: #e5e5e5;background-color: #000;font-weight: bold;',
    lightGreyBgRed: 'color: #e5e5e5;background-color: #b43836;',
    darkGrey: 'color: #666666;'
  }
  console.log(
    '%c████████████████████████████████████▇▆▅▃▁\n' +
      '%c       Bahn-Vorhersage      ███████▙  ▜' +
      '%c██▆▁\n' +
      '%c███████████████████████████████████████████▃\n' +
      '%c▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀' +
      '%c█████▄' +
      '%c▖\n' +
      '%c█████████████████████████████████████████████\n' +
      '%c ▜█▀▀▜█▘                       ▜█▀▀▜█▘' +
      '%c   ▀▀▀',
    styles.lightGrey,
    styles.lightGreyBgBlack,
    styles.lightGrey,
    styles.lightGrey,
    styles.lightGreyBgRed,
    styles.lightGrey,
    styles.darkGrey,
    styles.lightGrey,
    styles.darkGrey,
    styles.lightGrey
  )
}
