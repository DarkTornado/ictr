/* 20초마다 위치 갱신 */
setInterval(updateInfo, 20 * 1000);
updateInfo();

/* 자체 구축 API에서 위치 정보 불러옴 */
async function updateInfo() {
    const url = 'https://api.darktornado.net/subway/ictr/info';
    const line1 = await fetch(url + '?line=1&key=sample').then((res) => res.json());
    const line2 = await fetch(url + '?line=2&key=sample').then((res) => res.json());
    const src = await createMap(line1.data, line2.data);
    document.getElementById("subway_map").innerHTML = src + '</svg>';
}

/* SVG로 노선도 그리기 */
function createMap(data1, data2) {
    let src = '<svg viewBox="0 0 800 3800">';
    src += '<polyline points="100,600 100,1950 150,2000 350,2000 400,2050 400,2150 450,2200 650,2200 700,2250 700,3700" fill="none" stroke="#759CCE" />';
    src += '<polyline points="700,100 700,2000 700,2050 650,2100 150,2100 100,2150 100,2700" fill="none" stroke="#F5A251" />';
    src += drawLine(map_line1, data1);
    src += drawLine(map_line2, data2);

    /* 예외처리한 환승역 */
    let x = 400, y = 2100;
    src += '<circle cx="400" cy="' + y + '" r="12" />';
    src += '<text class=right x=430 y=' + (y + 50) + '>인천시청</text>';
    y -= 20;
    if (data1[14].up) src += '<image xlink:href="images/up.png" x=' + (x + 20) + ' y="' + y + '" width="20px"/>';
    if (data1[14].dn) src += '<image xlink:href="images/dn.png" x=' + (x - 40) + ' y="' + y + '" width="20px"/>';
    y += 20;
    x -= 20;
    if (data2[20].up) src += '<image xlink:href="images/up_2.png" x=' + x + ' y="' + (y + 20) + '" width="40px"/>';
    if (data2[20].dn) src += '<image xlink:href="images/dn_2.png" x=' + x + ' y="' + (y - 40) + '" width="40px"/>';

    return src;
}

function drawLine(map, data) {
    let src = '';
    map.forEach((e, i) => {
        if (e.stn == '인천시청') return;
        let x = e.x;
        if (e.align == 'left') x -= 40;
        else x += 40;
        src += '<circle cx="' + e.x + '" cy="' + e.y + '" r="12" />';
        src += '<text class=' + e.align + ' x=' + x + ' y=' + e.y + '>' + e.stn + '</text>';
        const y = e.y - 20;
        if (data[i].up) src += '<image xlink:href="images/up.png" x=' + (e.x + 20) + ' y="' + y + '" width="20px"/>';
        if (data[i].dn) src += '<image xlink:href="images/dn.png" x=' + (e.x - 40) + ' y="' + y + '" width="20px"/>';
    });
    return src;
}

