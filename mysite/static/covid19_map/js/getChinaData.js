// 获取疫情数据
$.ajax({
    url:'https://news.sina.com.cn/project/fymap/ncp2020_full_data.json',
    dataType: 'jsonp',
    jsonpCallback: 'jsoncallback',
    success: function(res){
        // 获取数据
        var allData = res.data;
        var historylist = allData.historylist;
        // 设置更新时间
        $('.time span').html(allData.cachetime)
        // 设置详情信息
        console.log(allData);
        (function(){
            var infoConfig = {
                'cn_econNum': {
                    'title': '现有确诊',
                    'color': '#ff5e49'
                },
                'cn_asymptomNum': {
                    'title': '无症状',
                    'color': '#fe653b'
                },
                'cn_susNum': {
                    'title': '现有疑似',
                    'color': '#fe8d00'
                },
                'cn_heconNum': {
                    'title': '现有重症',
                    'color': '#525498'
                },
                'cn_conNum': {
                    'title': '累计确诊',
                    'color': '#ff0910'
                },
                'cn_jwsrNum': {
                    'title': '境外输入',
                    'color': '#356ea0'
                },
                'cn_cureNum': {
                    'title': '累计治愈',
                    'color': '#00b1b7'
                },
                'cn_deathNum': {
                    'title': '累计死亡',
                    'color': '#4c5054'
                }
            }
            var htmlStr = '';
            for(var k in infoConfig){
                console.log(k);
                console.log(historylist[0][k]);
                var value = historylist[0][k] - historylist[1][k];
                htmlStr += `<li>
                                <h5>${infoConfig[k].title}</h5>
                                <p style='color:${infoConfig[k].color}'>${historylist[0][k]}</p>
                                <span>
                                    <em>昨天</em>
                                    <i style='color:#ff5e49'>
                                        ${value > 0 ? '+' + value : value}
                                    </i>
                                </span>
                            </li>`
            }
            $('.info').html(htmlStr);
        })();
        // 设置中国疫情地图
        (function() {
            // 获取数据
            var list = allData.list;
            var nowList = [];
            var countList = [];
            list.forEach(function(element){
                nowList.push({
                    name: element.name,
                    value: element.econNum
                })
                countList.push({
                    name: element.name,
                    value: element.value
                })
            })
            
            $.get('/static/covid19_map/json/china.json', function (geoJson) {
                
                echarts.registerMap('china', {geoJSON: geoJson});
                var china_map = echarts.init(document.querySelector('.china_map .content'));
                var option = {
                    geo: {
                        map: 'china',
                        zoom: 1.10,
                        top: '6%',
                        itemStyle: {
                            areaColor: '#fff',
                            borderWidth: 0.25
                        },
                        label: {
                            show: true,
                            fontSize: 12,
                        },
                        emphasis: {
                            itemStyle: {
                                areaColor: '#b4ffff'
                            }
                        },
                        select: {
                            itemStyle: {
                                areaColor: '#b4ffff'
                            }
                        },
                    },

                    tooltip: {
                        triggerOn: 'click',
                    },
                    
                    series: [{
                        name: '确诊人数',
                        type: 'map',
                        // map: 'china',
                        geoIndex: 0,
                        data: nowList
                    }], 

                    visualMap: {
                        type: 'piecewise',
                        pieces: [
                            { min: 0, max: 0, label: '0', color: '#fff'},
                            { min: 1, max: 9, label: '1-9', color: '#ffe4da'},
                            { min: 10, max: 99, label: '10-99', color: '#ff937f'},
                            { min: 100, max: 999, label: '100-999', color: '#ff6c5e'},
                            { min: 1000, max: 9999, label: '1000-9999', color: '#fe3335'},
                            { min: 10000, label: '>=10000', color: '#cd0000'},
                        ],
                        itemWidth: 40,
                        itemHeight: 40,
                        itemGap: 8,
                        inverse: false,
                        left: 180,
                        top: '50%'
                    }
        
                };
                china_map.setOption(option);
                
                // 设置地图切换效果
                $('.china_map nav a').click(function(){
                    $('.china_map nav a').toggleClass('active');
                    // 切换option中series的data
                    option.series[0].data = $(this).index() == 0 ? nowList : countList;
                    var title = $(this).index() == 0 ? '现有确诊病例，排除治愈、死亡' : '累计确诊病例，包含治愈、死亡';
                    document.querySelector('.china_map .title').innerHTML = title;
                    china_map.setOption(option);
                })
            });
        })();
        // 设置中国疫情新增趋势
    }

})