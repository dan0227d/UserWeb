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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9095693779904306, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8727272727272727, 500, 1500, "/api/user/login-169"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "/api/user/count-179"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user-180"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "/api/user/count-177"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-175"], "isController": false}, {"data": [0.7545454545454545, 500, 1500, "/api/user/register-186"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-173"], "isController": false}, {"data": [0.0, 500, 1500, "/api/user/users-182"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-189"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/search-172"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-183"], "isController": false}, {"data": [0.9727272727272728, 500, 1500, "/api/usercontent-184"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/search-176"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/me-185"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-170"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/search-174"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/me-187"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "/api/user/search-178"], "isController": false}, {"data": [0.7090909090909091, 500, 1500, "/api/user/login-188"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1045, 0, 0.0, 396.017224880383, 9, 3873, 206.0, 651.4, 2856.499999999998, 3452.24, 110.95774049692079, 292.47870600180505, 67.16941627734127], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/user/login-169", 55, 0, 0.0, 370.56363636363636, 113, 990, 273.0, 797.0, 857.3999999999997, 990.0, 28.306742151312402, 40.08781523417396, 7.735601357436953], "isController": false}, {"data": ["/api/user/count-179", 55, 0, 0.0, 178.43636363636364, 32, 503, 130.0, 369.59999999999985, 464.79999999999984, 503.0, 57.232049947970864, 22.57983220603538, 37.77294972684704], "isController": false}, {"data": ["/api/user-180", 55, 0, 0.0, 148.20000000000005, 20, 397, 128.0, 266.0, 312.19999999999976, 397.0, 62.92906178489703, 277.9225364702517, 40.488236556064074], "isController": false}, {"data": ["/api/user/count-177", 55, 0, 0.0, 197.32727272727274, 22, 535, 175.0, 351.99999999999994, 451.39999999999986, 535.0, 40.35216434336023, 15.920189838591343, 26.632285170579603], "isController": false}, {"data": ["/api/user/count-175", 55, 0, 0.0, 194.52727272727273, 20, 458, 193.0, 376.8, 433.4, 458.0, 61.452513966480446, 24.244937150837988, 40.49842877094972], "isController": false}, {"data": ["/api/user/register-186", 55, 0, 0.0, 579.3090909090907, 125, 1276, 484.0, 1131.8, 1170.5999999999997, 1276.0, 36.27968337730871, 16.220857725923484, 10.94188035949868], "isController": false}, {"data": ["/api/user/count-173", 55, 0, 0.0, 201.50909090909096, 55, 414, 196.0, 344.7999999999999, 413.0, 414.0, 75.54945054945054, 29.806619162087912, 49.788590315934066], "isController": false}, {"data": ["/api/user/users-182", 55, 0, 0.0, 3213.454545454545, 2799, 3873, 3180.0, 3515.4, 3786.4, 3873.0, 13.850415512465373, 487.53487196235204, 8.992441293125157], "isController": false}, {"data": ["/api/usercontent-189", 55, 0, 0.0, 64.36363636363636, 9, 245, 52.0, 125.79999999999998, 175.39999999999975, 245.0, 51.74035747883349, 19.048940204609597, 34.653729127469425], "isController": false}, {"data": ["/api/user/search-172", 55, 0, 0.0, 211.99999999999997, 46, 468, 204.0, 339.8, 375.5999999999998, 468.0, 109.78043912175649, 88.76777694610779, 74.06281187624751], "isController": false}, {"data": ["/api/usercontent-183", 55, 0, 0.0, 139.16363636363636, 26, 457, 116.0, 236.6, 310.5999999999999, 457.0, 58.016877637130804, 21.35972936445148, 37.72436214398734], "isController": false}, {"data": ["/api/usercontent-184", 55, 0, 0.0, 332.8727272727273, 48, 646, 367.0, 470.8, 502.99999999999994, 646.0, 46.531302876480545, 21.54716582064298, 35.25456720600677], "isController": false}, {"data": ["/api/user/search-176", 55, 0, 0.0, 192.59999999999997, 20, 462, 201.0, 349.8, 387.7999999999997, 462.0, 42.868277474668744, 35.667746492595484, 28.962727737724087], "isController": false}, {"data": ["/api/user/me-185", 55, 0, 0.0, 173.8363636363637, 21, 454, 147.0, 320.8, 329.5999999999999, 454.0, 53.191489361702125, 22.726328276112184, 34.37896669487427], "isController": false}, {"data": ["/api/usercontent-170", 55, 0, 0.0, 187.41818181818184, 96, 363, 180.0, 282.2, 314.79999999999984, 363.0, 149.05149051490517, 54.875402269647694, 96.91787347560975], "isController": false}, {"data": ["/api/user/search-174", 55, 0, 0.0, 228.34545454545452, 51, 449, 225.0, 411.79999999999995, 435.59999999999997, 449.0, 80.52708638360176, 67.2369715409956, 54.327187042459734], "isController": false}, {"data": ["/api/user/me-187", 55, 0, 0.0, 135.49090909090904, 21, 389, 127.0, 242.39999999999998, 326.1999999999997, 389.0, 39.53989935298347, 16.893618574766354, 25.55560859992811], "isController": false}, {"data": ["/api/user/search-178", 55, 0, 0.0, 213.7454545454545, 44, 597, 197.0, 353.6, 397.0, 597.0, 42.80155642023346, 27.921327821011676, 28.875851167315176], "isController": false}, {"data": ["/api/user/login-188", 55, 0, 0.0, 561.1636363636363, 151, 990, 554.0, 898.4, 975.0, 990.0, 34.63476070528967, 51.08996182304786, 9.566376731738035], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1045, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
