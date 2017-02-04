document.addEventListener('DOMContentLoaded',function(){
	init();
	resizeMap();
});
//지도 API ----------------------------------------------------------
var container = document.getElementById('homeMap'); //지도를 담을 영역의 DOM 레퍼런스
var options = { //지도를 생성할 때 필요한 기본 옵션
	center: new daum.maps.LatLng(36.78487940520252, 126.45032439280797), //지도의 중심좌표.
	level: 3 //지도의 레벨(확대, 축소 정도)
};
var map = new daum.maps.Map(container, options); //지도 생성 및 객체 리턴

// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
var mapTypeControl = new daum.maps.MapTypeControl();

// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
// daum.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new daum.maps.ZoomControl();
map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

// 마커가 표시될 위치입니다
var markerPosition  = new daum.maps.LatLng(36.78487940520252, 126.45032439280797);

// 마커를 생성합니다
var marker = new daum.maps.Marker({
	position: markerPosition,
	id_num:1
	});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);

// 아래 코드는 지도 위의 마커를 제거하는 코드입니다
// marker.setMap(null);

// 마커에 클릭이벤트를 등록합니다
daum.maps.event.addListener(marker, 'click', function() {
	//evtfn
});

//------------------------------------------------------------------

var currentSellList=[];
var changingSellList=[];
var currentMarkers=[];

function init(){
	var header=document.querySelector('#header');
	var filter=document.querySelector('.filter');
	var list=document.querySelector('.list');
	var body=document.querySelector('#BODY');

	header.addEventListener('mouseover',function(evt){
		var target=evt.target;
		changeColor(target,'#8ec84b');
	});
	header.addEventListener('mouseout',function(evt){
		var target=evt.target;
		changeColor(target,'#000');
	});
	header.addEventListener('click',function(evt){
		var target=evt.target;
		selectTab(target);
		clickSerchButton(target);
	});

	filter.addEventListener('click', function (evt) {
		var target = evt.target;
		selectTab(target);
		clickFilterSubmit(target);
	});
	list.addEventListener('mouseover',function(evt){
		var target=evt.target;
		highlightMarker(target.id,'add');
	});
	list.addEventListener('mouseout',function(evt){
		var target=evt.target;
		highlightMarker(target.id,'cancel');
	});
	window.addEventListener('resize',function(evt){
		var target=evt.target;
		resizeMap();
	});
}
function resizeMap(){
	var container=document.querySelector('#BODY');
	var map=document.querySelector('.map');
	var containerWidth=window.getComputedStyle(container,null).width;
	containerWidth=Number(containerWidth.replace(/(.+)px/,'$1'));
	var mapWidth=containerWidth-400;
	mapWidth+='px';
	map.style.width=mapWidth;
}
function highlightMarker(id_num,ver){
	var aim;
	var I;
	var aimData;
	var marker;
	for(var i=0;i<currentSellList.length;i++){
		if(currentSellList[i].id_num==id_num) aimData=currentSellList[i];
	}
	for(var i=0;i<currentMarkers.length;i++){
		if(currentMarkers[i].id_num==id_num) aim=currentMarkers[i];
		I=i;
		aim.setMap(null);
	}
	if(ver=='add') {
		var imageSrc = 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
			imageSize = new daum.maps.Size(64, 69),
			imageOption = {offset: new daum.maps.Point(27, 69)};
		var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption),
			markerPosition = new daum.maps.LatLng(aimData.latitude, aimData.longitude);
		marker = new daum.maps.Marker({
			position: markerPosition,
			image: markerImage
		});
	}
	else if(ver=='cancel'){
		var markerPosition = new daum.maps.LatLng(data.latitude,data.longitude);
		marker = new daum.maps.Marker({
			position: markerPosition
		});
	}
	marker.id_num=id_num;
	marker.setMap(map);
	currentMarkers[I]=marker;
}


function changeColor(target,color){
	if(target.tagName=='NAV') {
		if (target.classList[1] == 'selectedTab') return;
		target.style.color = color;
	}
}
function selectTab(target){
	if(target.tagName=='NAV') {
		if (target.classList[1] == 'selectedTab') return;
		var cancelTab = document.querySelector('.selectedTab');
		cancelTab.classList.toggle('selectedTab');
		target.classList.toggle('selectedTab');
		var tabs=document.querySelectorAll('.tab');
		for(var i=0;i<3;i++){
			changeColor(tabs[i],'#000');
		}
	}
	if(target.classList[0]=='filterTab'){
		if(target.classList[1]=='selectedFilterTab')return;
		var cancelTab = document.querySelector('.selectedFilterTab');
		cancelTab.classList.toggle('selectedFilterTab');
		target.classList.toggle('selectedFilterTab');
		if(target.id=='tradingTab')selectWindow('trading');
		else if(target.id=='charterTab')selectWindow('charter');
	}
}
function selectWindow(window){
	wrap=document.querySelector('#'+window+'Window');
	var cancelWrap=document.querySelector('.selectedFilterWindow');
	cancelWrap.classList.toggle('selectedFilterWindow');
	wrap.classList.toggle('selectedFilterWindow');
}

function callAjax(url,fn){
	var oReq=new XMLHttpRequest();
	oReq.addEventListener('load',fn);
	oReq.open('GET',url);
	oReq.send();
	document.querySelector('.list').innerHTML='';
}
function clickSerchButton(target){
	if (target.id !== 'serchButton') return;
	var serchText = document.querySelector('#serchBox').value;
	var kind=document.querySelector('.selectedTab').id;
	var url='/api/realestate/'+kind+'?search='+serchText;
	var filterCondition='';
	filterCondition=filtering();
	url+=filterCondition;
	callAjax(url,preWriteSellList);
}
function clickFilterSubmit(target){
	if(target.className!=='filterSubmit') return;
	var selectedFilterTab=document.querySelector('.selectedFilterTab');
	var checklist=[];
	if(selectedFilterTab.id=='tradingTab') {
		var minTradingPrice = Number(document.querySelector('.minTradingPrice').value);
		var maxTradingPrice = Number(document.querySelector('.maxTradingPrice').value);
		if(maxTradingPrice=="")maxTradingPrice=999999999;
		var minTradingArea = Number(document.querySelector('.minTradingArea').value);
		var maxTradingArea = Number(document.querySelector('.maxTradingArea').value);
		if(maxTradingArea=="")maxTradingArea=999999999;
		var checkBoxes = document.querySelectorAll('.tradingCheck');
		for(var i=0;i<checkBoxes.length;i++){
			if(checkBoxes[i].checked) checklist.push('checkBoxes[i].value');
		}
		var is_direct_trading = document.querySelector('.is_direct_select_trading').value;
		for(var i=0;i<currentSellList.length;i++){
			var subject_trading=currentSellList[i];
			if(subject_trading.price<minTradingPrice||subject_trading.price>maxTradingPrice) continue;
			if(subject_trading.area<minTradingArea||subject_trading.area>maxTradingArea) continue;
			if(subject_trading.is_direct==is_direct_trading) continue;
			var index =checkBoxes.indexOf(subject_trading.room_type)
			if(index==-1) continue;
			changingSellList.push(subject_trading);
		}
	}
	else if(selectedFilterTab.id=='charterTab') {
		var minDepositPrice = Number(document.querySelector('.minDepositPrice').value);
		var maxDepositPrice = Number(document.querySelector('.maxDepositPrice').value);
		if(maxDepositPrice=="")maxDepositPrice=999999999;
		var minRentPrice = Number(document.querySelector('.minRentPrice').value);
		var maxRentPrice = Number(document.querySelector('.maxRentPrice').value);
		if(maxRentPrice=="")maxRentPrice=999999999;
		var minCharterArea = Number(document.querySelector('.minCharterArea').value);
		var maxCharterArea = Number(document.querySelector('.maxCharterArea').value);
		if(maxCharterArea=="")maxCharterArea=999999999;
		var checkBoxes = document.querySelectorAll('.charterCheck');
		for(var i=0;i<checkBoxes.length;i++){
			if(checkBoxes[i].checked) checklist.push('checkBoxes[i].value');
		}
		var is_direct_charter = document.querySelector('.is_direct_select_charter').value;
		for(var i=0;i<currentSellList.length;i++){
			var subject_charter=currentSellList[i];
			if(subject_charter.deposit_price<minDepositPrice||subject_charter.deposit_price>maxDepositPrice) continue;
			if(subject_charter.rent_price<minRentPrice||subject_charter.rent_price>maxRentPrice) continue;
			if(subject_charter.area<minCharterArea||subject_charter.area>maxCharterArea) continue;
			if(subject_charter.is_direct==is_direct_charter) continue;
			var index =checkBoxes.indexOf(subject_charter.room_type)
			if(index==-1) continue;
			changingSellList.push(subject_charter);
		}
	}
	preWriteSellList(changingSellList);
	changingSellList=[];
	currentSellList=[];
}
//------------------------------------------
function filtering(){

}
function preWriteSellList(preData){
	cleanMarkers(currentMarkers);


	writeSellList();
}
//------------------------------------

function writeSellList(data,id_num) {
	//매매일때
	if (data.임전 == 매매) {
		var temp = document.querySelector('#sellListTradingTemp');
		temp = temp.innerHTML;
		temp.replace('{{url}}', data.url);
		temp.replace('{{id_num}}','T_'+id_num);
		temp.replace('{{price}}', data.price);
		temp.replace('{{{{direct}}', data.is_direct);
		temp.replace('{{area}}', data.area);
		temp.replace('{{location}}', data.location);
		insertSellList(temp);
		var obj = {
			id_num: id_num,
			latitude:data.latitude,
			longitude:data.longitude,
			price: data.price,
			is_direct: data.is_direct,
			area: data.area,
		}
		currentSellList.push(obj)
	}
	//임전세일때
	else if (data.임전 == 임전) {
		var temp = document.querySelector('#sellListCharterTemp');
		temp = temp.innerHTML;
		temp.replace('{{url}}', data.url);
		temp.replace('{{id_num', 'C_'+id_num);
		temp.replace('{{depositPrice}}', data.deposit_price);
		temp.replace('{{rentPrice}}', data.rent_price);
		temp.replace('{{{{direct}}', data.is_direct);
		temp.replace('{{area}}', data.area);
		temp.replace('{{location}}', data.location);
		insertSellList(temp);
		var obj = {
			id_num: id_num,
			latitude:data.latitude,
			longitude:data.longitude,
			deposit_price: data.deposit_price,
			rent_price: data.rent_price,
			is_direct: data.is_direct,
			area: data.area,
		}
		currentSellList.push(obj);
	}
	createMarker(data,id_num);
}
function createMarker(data,id_num) {
	var markerPosition = new daum.maps.LatLng(data.latitude,data.longitude);
	var marker = new daum.maps.Marker({
			position: markerPosition
		});
		marker.id_num=id_num
	marker.setMap(map);
	daum.maps.event.addListener(marker, 'click', function() {
		var id_num=marker.id_num
		clickMarker(id_num);
	});
	currentMarkers.push(marker);
}
function clickMarker(id_num){
	document.querySelector('.selectedSellList').classList.toggle('selectedSellList');
	document.querySelector('#'+id_num).classList.toggle('selectedSellList');
}
function cleanMarkers(currentMarkers){
	for(var i=0;i<currentMarkers.length;i++){
		currentMarkers[i].setMap(null);
	}
	currentMarkers=[];
}
function insertSellList(temp) {
	var list = document.querySelector('.list');
	var listData = list.innerHTML;
	listData += temp;
	list.innerHTML = listData;
}



