//YYYY-MM-DD-mm-ss-msms方式で日時を出力
export const getDate = () => {
  const date = new Date()
  return (
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2) +
    "-" +
    ("0" + date.getHours()).slice(-2) +
    "-" +
    ("0" + date.getMinutes()).slice(-2) +
    "-" +
    ("0" + date.getSeconds()).slice(-2) +
    "-" +
    date.getMilliseconds()
  )
}
