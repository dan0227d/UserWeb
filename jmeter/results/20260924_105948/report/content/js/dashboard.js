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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8926315789473684, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.84, 500, 1500, "/api/user/login-169"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-179"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user-180"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-177"], "isController": false}, {"data": [0.99, 500, 1500, "/api/user/count-175"], "isController": false}, {"data": [0.78, 500, 1500, "/api/user/register-186"], "isController": false}, {"data": [0.99, 500, 1500, "/api/user/count-173"], "isController": false}, {"data": [0.0, 500, 1500, "/api/user/users-182"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-189"], "isController": false}, {"data": [0.99, 500, 1500, "/api/user/search-172"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-183"], "isController": false}, {"data": [0.91, 500, 1500, "/api/usercontent-184"], "isController": false}, {"data": [0.97, 500, 1500, "/api/user/search-176"], "isController": false}, {"data": [0.88, 500, 1500, "/api/user/me-185"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-170"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/search-174"], "isController": false}, {"data": [0.97, 500, 1500, "/api/user/me-187"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/search-178"], "isController": false}, {"data": [0.64, 500, 1500, "/api/user/login-188"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 950, 0, 0.0, 425.8210526315787, 11, 4236, 244.0, 689.9999999999995, 2785.899999999997, 3550.7200000000003, 94.73474272038293, 246.14497376096926, 57.347142843787395], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/user/login-169", 50, 0, 0.0, 428.15999999999997, 144, 917, 344.5, 870.3, 889.8499999999999, 917.0, 25.150905432595575, 35.61653121856137, 6.872779646629779], "isController": false}, {"data": ["/api/user/count-179", 50, 0, 0.0, 181.64000000000004, 28, 412, 180.5, 290.7, 343.74999999999966, 412.0, 45.662100456621005, 18.015125570776256, 30.13609446347032], "isController": false}, {"data": ["/api/user-180", 50, 0, 0.0, 152.56000000000003, 35, 387, 149.0, 270.7, 311.8999999999999, 387.0, 51.493305870236874, 206.91961412203915, 33.1297068099897], "isController": false}, {"data": ["/api/user/count-177", 50, 0, 0.0, 230.69999999999996, 47, 435, 230.5, 371.29999999999995, 396.7999999999999, 435.0, 35.51136363636364, 14.010342684659092, 23.43680641867898], "isController": false}, {"data": ["/api/user/count-175", 50, 0, 0.0, 242.10000000000002, 44, 505, 244.0, 387.29999999999995, 470.25, 505.0, 35.842293906810035, 14.140905017921147, 23.620211693548388], "isController": false}, {"data": ["/api/user/register-186", 50, 0, 0.0, 454.5, 155, 796, 456.0, 660.0, 734.1999999999998, 796.0, 29.97601918465228, 13.40197373351319, 9.040228754496404], "isController": false}, {"data": ["/api/user/count-173", 50, 0, 0.0, 238.94000000000005, 47, 555, 257.5, 434.29999999999995, 481.45, 555.0, 51.65289256198347, 20.37868026859504, 34.03945796745868], "isController": false}, {"data": ["/api/user/users-182", 50, 0, 0.0, 3248.9200000000005, 2721, 4236, 3261.5, 3610.6, 3703.45, 4236.0, 11.737089201877934, 409.4160339642019, 7.620167620305165], "isController": false}, {"data": ["/api/usercontent-189", 50, 0, 0.0, 59.28000000000002, 11, 303, 38.5, 139.8, 189.44999999999982, 303.0, 40.38772213247173, 14.869307855411956, 27.04951913368336], "isController": false}, {"data": ["/api/user/search-172", 50, 0, 0.0, 212.23999999999998, 45, 519, 240.5, 336.0, 444.2999999999998, 519.0, 62.266500622665006, 50.348303237858026, 42.006781211083435], "isController": false}, {"data": ["/api/usercontent-183", 50, 0, 0.0, 93.85999999999999, 36, 226, 77.5, 156.6, 170.49999999999994, 226.0, 62.421972534332085, 22.98152699750312, 40.58769311797752], "isController": false}, {"data": ["/api/usercontent-184", 50, 0, 0.0, 330.19999999999993, 79, 603, 348.0, 554.0, 583.6999999999999, 603.0, 45.49590536851683, 21.064071030482257, 34.469368459963604], "isController": false}, {"data": ["/api/user/search-176", 50, 0, 0.0, 305.6600000000001, 66, 615, 303.0, 454.59999999999997, 545.5999999999999, 615.0, 31.17206982543641, 25.936136221945137, 21.060020846321695], "isController": false}, {"data": ["/api/user/me-185", 50, 0, 0.0, 353.59999999999997, 38, 896, 252.5, 749.4, 787.9, 896.0, 42.08754208754209, 17.980093907828284, 27.201540140993266], "isController": false}, {"data": ["/api/usercontent-170", 50, 0, 0.0, 209.80000000000004, 91, 400, 201.5, 328.7, 356.09999999999985, 400.0, 124.06947890818859, 45.67792338709677, 80.67181684243175], "isController": false}, {"data": ["/api/user/search-174", 50, 0, 0.0, 259.0, 86, 489, 262.5, 424.7, 473.74999999999994, 489.0, 41.87604690117253, 34.96486337939699, 28.250791719011726], "isController": false}, {"data": ["/api/user/me-187", 50, 0, 0.0, 207.88000000000002, 26, 745, 198.0, 491.5, 568.5499999999995, 745.0, 32.03074951953876, 13.683761410954517, 20.701748678731583], "isController": false}, {"data": ["/api/user/search-178", 50, 0, 0.0, 218.29999999999995, 35, 449, 231.0, 348.3, 352.9, 449.0, 35.31073446327684, 23.03473693502825, 23.821642169844633], "isController": false}, {"data": ["/api/user/login-188", 50, 0, 0.0, 663.26, 183, 1240, 703.5, 1046.1, 1106.4999999999995, 1240.0, 28.62049227246709, 42.21690308385804, 7.904734008299942], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 950, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
