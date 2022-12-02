
let BMapGL = (window as any).BMapGL;

export function setMarker(markers: any[], map: any) {
  const points: any = []
  markers.forEach((item) => {
    const { lat, lnt: lng } = item;
    const point = new BMapGL.Point(lng, lat);
    point.data = item
    points.push(point)

    const marker = new BMapGL.Marker(point);

    map.addOverlay(marker);

    marker.addEventListener("click", function () {
      const infoWindow = new BMapGL.InfoWindow(
        `
      <div class="map-hover-box">
        <div class="map-hover-title">换热站名称：${item.name}</div>
        <div class="map-hover-row-item">
          <div class="map-hover-label">换热站编号：</div>
          <div class="map-hover-value">${item.code}</div>
        </div>
        <div class="map-hover-row-item">
          <div class="map-hover-label">位置：</div>
          <div class="map-hover-value">${item.position}</div>
        </div>
      </div>
    `,
        {
          width: 200, // 信息窗口宽度
          height: 100, // 信息窗口高度
          title: item.stationName,
        }
      );
      map.openInfoWindow(infoWindow, point); //开启信息窗口
    });
  });
  return points
}

export function setLine(lines: any[], map: any) {
  lines.forEach((item) => {
    const polyline = new BMapGL.Polyline(item.loopViaPointInfo.map((item: any) => {
      return new BMapGL.Point(item.lnt, item.lat)
    }), { strokeColor: "blue", strokeWeight: 10, strokeOpacity: 0.5 });   //创建折线

    map.addOverlay(polyline);

    polyline.addEventListener("click", function (e: any) {
      const infoWindow = new BMapGL.InfoWindow(
        `
      <div class="map-hover-box">
        <div class="map-hover-title">环路名称：${item.name}</div>
        <div class="map-hover-row-item">
          <div class="map-hover-label">环路编号：</div>
          <div class="map-hover-value">${item.code}</div>
        </div>
        <div class="map-hover-row-item">
          <div class="map-hover-label">所属换热站：</div>
          <div class="map-hover-value">${item.stationInfo.name}</div>
        </div>
        <div class="map-hover-row-item">
          <div class="map-hover-btn" onclick="window.mapToDetail('${item.code}')">去详情页</div>
        </div>
      </div>
    `,
        {
          width: 200, // 信息窗口宽度
          height: 100, // 信息窗口高度
          title: item.name,
        }
      );
      // map.closeInfoWindow()
      setTimeout(() => {
        map.openInfoWindow(infoWindow, e.latLng); //开启信息窗口
      }, 100)
    });
  });
}
