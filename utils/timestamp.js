const timestampToStrDate = (UNIX_timestamp) => {
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate().toString().length == 1 ? '0' + a.getDate() : a.getDate();
    let hour = a.getHours().toString().length == 1 ? '0' + a.getHours() : a.getHours();
    let min = a.getMinutes().toString().length == 1 ? '0' + a.getMinutes() : a.getMinutes();
    let sec = a.getSeconds().toString().length == 1 ? '0' + a.getSeconds() : a.getSeconds();
    let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}


module.exports = { timestampToStrDate }