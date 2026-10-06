/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 77.14285714285714, "KoPercent": 22.857142857142858};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6845864661654135, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.42857142857142855, 500, 1500, "/api/user/login-169"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "/api/user/count-179"], "isController": false}, {"data": [0.7214285714285714, 500, 1500, "/api/user-180"], "isController": false}, {"data": [0.7214285714285714, 500, 1500, "/api/user/count-177"], "isController": false}, {"data": [0.7285714285714285, 500, 1500, "/api/user/count-175"], "isController": false}, {"data": [0.7071428571428572, 500, 1500, "/api/user/register-186"], "isController": false}, {"data": [0.7, 500, 1500, "/api/user/count-173"], "isController": false}, {"data": [0.0, 500, 1500, "/api/user/users-182"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-189"], "isController": false}, {"data": [0.6857142857142857, 500, 1500, "/api/user/search-172"], "isController": false}, {"data": [0.7285714285714285, 500, 1500, "/api/usercontent-183"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "/api/usercontent-184"], "isController": false}, {"data": [0.7285714285714285, 500, 1500, "/api/user/search-176"], "isController": false}, {"data": [0.7285714285714285, 500, 1500, "/api/user/me-185"], "isController": false}, {"data": [0.7071428571428572, 500, 1500, "/api/usercontent-170"], "isController": false}, {"data": [0.7214285714285714, 500, 1500, "/api/user/search-174"], "isController": false}, {"data": [0.7214285714285714, 500, 1500, "/api/user/me-187"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "/api/user/search-178"], "isController": false}, {"data": [0.8357142857142857, 500, 1500, "/api/user/login-188"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1330, 304, 22.857142857142858, 382.14511278195477, 8, 4388, 185.0, 675.2000000000007, 1241.0, 4002.9000000000005, 124.9060856498873, 245.79283888406275, 62.73130077244553], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/user/login-169", 70, 19, 27.142857142857142, 705.0285714285716, 256, 1356, 602.0, 1244.6, 1272.45, 1356.0, 33.2541567695962, 38.17083580760095, 9.088758165083135], "isController": false}, {"data": ["/api/user/count-179", 70, 19, 27.142857142857142, 213.85714285714286, 27, 691, 182.0, 379.0, 411.6, 691.0, 38.230475150191154, 14.637237165483343, 20.237404423812126], "isController": false}, {"data": ["/api/user-180", 70, 19, 27.142857142857142, 158.0857142857143, 27, 677, 114.0, 365.19999999999993, 409.5500000000001, 677.0, 41.05571847507331, 112.25256598240469, 21.05136546920821], "isController": false}, {"data": ["/api/user/count-177", 70, 19, 27.142857142857142, 187.98571428571432, 50, 580, 170.0, 310.0, 345.8, 580.0, 39.01895206243032, 14.939119983277592, 20.65478678929766], "isController": false}, {"data": ["/api/user/count-175", 70, 19, 27.142857142857142, 192.08571428571432, 20, 419, 185.5, 329.0, 343.70000000000005, 419.0, 56.36070853462158, 21.5787288647343, 29.779652274557165], "isController": false}, {"data": ["/api/user/register-186", 70, 0, 0.0, 607.4285714285714, 122, 1352, 617.0, 1047.3, 1185.5500000000002, 1352.0, 11.013215859030838, 4.921530837004405, 3.3219411284612965], "isController": false}, {"data": ["/api/user/count-173", 70, 19, 27.142857142857142, 241.14285714285717, 49, 682, 202.5, 439.99999999999994, 539.7, 682.0, 72.23942208462331, 27.658184984520126, 38.16958526831785], "isController": false}, {"data": ["/api/user/users-182", 70, 19, 27.142857142857142, 2772.1571428571433, 39, 4388, 3586.0, 4127.0, 4302.95, 4388.0, 13.474494706448507, 337.5505669513956, 6.9880143166506254], "isController": false}, {"data": ["/api/usercontent-189", 70, 0, 0.0, 46.19999999999999, 8, 194, 30.5, 90.9, 157.70000000000002, 194.0, 12.28716868527295, 4.5236939397928735, 8.229900331314727], "isController": false}, {"data": ["/api/user/search-172", 70, 19, 27.142857142857142, 249.2857142857143, 46, 591, 199.0, 448.8, 565.45, 591.0, 76.58643326039387, 52.42666165207877, 41.66310516958424], "isController": false}, {"data": ["/api/usercontent-183", 70, 19, 27.142857142857142, 142.7857142857143, 22, 386, 114.0, 269.8, 329.35, 386.0, 13.040238450074515, 4.742186044616244, 6.77553907414307], "isController": false}, {"data": ["/api/usercontent-184", 70, 19, 27.142857142857142, 192.88571428571433, 43, 650, 118.5, 419.29999999999995, 438.55000000000007, 650.0, 12.82051282051282, 5.548341632326007, 8.038576007326007], "isController": false}, {"data": ["/api/user/search-176", 70, 19, 27.142857142857142, 175.22857142857137, 41, 353, 162.5, 286.4, 316.0, 353.0, 50.61460592913955, 35.51213394793926, 27.583830441070138], "isController": false}, {"data": ["/api/user/me-185", 70, 19, 27.142857142857142, 163.3428571428571, 18, 493, 99.5, 368.09999999999997, 427.6000000000002, 493.0, 12.50893495353824, 5.087164660025018, 6.4506176286633305], "isController": false}, {"data": ["/api/usercontent-170", 70, 19, 27.142857142857142, 268.07142857142856, 91, 556, 252.0, 464.59999999999997, 510.3000000000002, 556.0, 124.11347517730496, 45.13484873670213, 64.48775487588654], "isController": false}, {"data": ["/api/user/search-174", 70, 19, 27.142857142857142, 198.68571428571428, 38, 527, 169.5, 361.0, 400.80000000000007, 527.0, 67.04980842911877, 47.18648976293103, 36.47517061781609], "isController": false}, {"data": ["/api/user/me-187", 70, 19, 27.142857142857142, 93.57142857142858, 9, 589, 65.5, 220.79999999999995, 330.2000000000001, 589.0, 12.444444444444443, 5.0609375, 6.417361111111111], "isController": false}, {"data": ["/api/user/search-178", 70, 19, 27.142857142857142, 192.75714285714284, 49, 682, 160.5, 369.2, 428.05000000000007, 682.0, 36.30705394190872, 20.720549144190873, 19.751077865663902], "isController": false}, {"data": ["/api/user/login-188", 70, 0, 0.0, 460.1714285714285, 108, 1440, 326.5, 980.1, 1250.15, 1440.0, 11.976047904191617, 17.664002352437983, 3.308282987596236], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 304, 100.0, 22.857142857142858], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1330, 304, "401/Unauthorized", 304, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/user/login-169", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/user/count-179", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/user-180", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/user/count-177", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/user/count-175", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/user/count-173", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/user/users-182", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/user/search-172", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/usercontent-183", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/usercontent-184", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/user/search-176", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/user/me-185", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/usercontent-170", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/user/search-174", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/user/me-187", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/user/search-178", 70, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
