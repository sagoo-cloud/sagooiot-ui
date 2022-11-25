
let BMapGL = (window as any).BMapGL;

export function setMarker(markers: any[], map: any) {
  const points: any = []
  markers.forEach((item) => {
    const { lat, lnt: lng } = item.stationInfo;
    const point = new BMapGL.Point(lng, lat);
    points.push(point)

    const marker = new BMapGL.Marker(point);

    map.addOverlay(marker);

    marker.addEventListener("click", function () {
      const infoWindow = new BMapGL.InfoWindow(
        `
      <div class="map-hover-box">
        <div class="map-hover-title">环路名称：${item.name}</div>
        <div class="map-hover-row-item">
          <div class="map-hover-label">环路编号：</div>
          <div class="map-hover-value">SJIWW786</div>
        </div>
        <div class="map-hover-row-item">
          <div class="map-hover-label">所属换热站：</div>
          <div class="map-hover-value">**换热站1</div>
        </div>
        <div class="map-hover-row-item">
          <div class="map-hover-label">一网供水温度：</div>
          <div class="map-hover-value"></div>
        </div>
        <div class="map-hover-row-item">
          <div class="map-hover-label">一网回水温度：</div>
          <div class="map-hover-value">24℃</div>
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
