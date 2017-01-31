document.addEventListener('DOMContentLoaded',function(){
	init();
});

var container = document.getElementById('homeMap'); //지도를 담을 영역의 DOM 레퍼런스
var options = { //지도를 생성할 때 필요한 기본 옵션
	center: new daum.maps.LatLng(36.784772, 126.450320), //지도의 중심좌표.
	level: 3 //지도의 레벨(확대, 축소 정도)
};
var map = new daum.maps.Map(container, options); //지도 생성 및 객체 리턴

function init(){
	var header=document.querySelector('#header');
	var filter=document.querySelector('.filter');
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
	})

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

function clickSerchButton(target) {
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
	var kind=document.querySelector('.selectedtab').id;

}
//------------------------------------------
function filtering(){

}
function preWriteSellList(preData){

	writeSellList();
}
//------------------------------------

function writeSellList(data){
	//매매일때
	if(data.임전==매매) {
		var temp = document.querySelector('#sellListTradingTemp');
		temp = temp.innerHTML;
		temp.replace('{{url}}', data.url);
		temp.replace('{{price}}', data.price);
		temp.replace('{{{{direct}}',data.is_direct);
		temp.replace('{{area}}',data.area);
		temp.replace('{{location}}',data.location);
		insertSellList(temp);
	}
	//
	else if(data.임전==임전){
		var temp = document.querySelector('#sellListCharterTemp');
		temp = temp.innerHTML;
		temp.replace('{{url}}', data.url);
		temp.replace('{{depositPrice}}', data.deposit_price);
		temp.replace('{{rentPrice}}', data.rent_price);
		temp.replace('{{{{direct}}',data.is_direct);
		temp.replace('{{area}}',data.area);
		temp.replace('{{location}}',data.location);
		insertSellList(temp);

	}
}
function insertSellList(temp) {
	var list = document.querySelector('.list');
	var listData = list.innerHTML;
	listData += temp;
	list.innerHTML = listData;
}



