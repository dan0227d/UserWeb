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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9421052631578948, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.95, 500, 1500, "/api/user/login-169"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-179"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user-180"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-177"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-175"], "isController": false}, {"data": [0.975, 500, 1500, "/api/user/register-186"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-173"], "isController": false}, {"data": [0.025, 500, 1500, "/api/user/users-182"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-189"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/search-172"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-183"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-184"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/search-176"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/me-185"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-170"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/search-174"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/me-187"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/search-178"], "isController": false}, {"data": [0.95, 500, 1500, "/api/user/login-188"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 380, 0, 0.0, 200.1, 10, 2102, 87.0, 350.90000000000003, 1510.499999999999, 2023.55, 72.38095238095238, 189.23697916666666, 43.796316964285715], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/user/login-169", 20, 0, 0.0, 232.0, 92, 561, 151.0, 552.5000000000002, 561.0, 561.0, 9.394081728511038, 13.29069912517614, 2.5645659640676373], "isController": false}, {"data": ["/api/user/count-179", 20, 0, 0.0, 75.55000000000001, 20, 126, 82.0, 101.80000000000001, 124.79999999999998, 126.0, 41.75365344467641, 16.47312108559499, 27.54558650835073], "isController": false}, {"data": ["/api/user-180", 20, 0, 0.0, 94.7, 15, 168, 105.5, 133.4, 166.29999999999998, 168.0, 47.28132387706856, 198.40610224586288, 30.40733968676123], "isController": false}, {"data": ["/api/user/count-177", 20, 0, 0.0, 89.5, 18, 155, 92.5, 141.70000000000002, 154.39999999999998, 155.0, 27.3224043715847, 10.779542349726777, 18.025049094945356], "isController": false}, {"data": ["/api/user/count-175", 20, 0, 0.0, 78.90000000000002, 38, 151, 77.5, 120.50000000000001, 149.49999999999997, 151.0, 23.25581395348837, 9.175145348837209, 15.319540334302326], "isController": false}, {"data": ["/api/user/register-186", 20, 0, 0.0, 321.15, 149, 501, 319.0, 470.0, 499.5, 501.0, 30.165912518853695, 13.478919211915535, 9.089543269230768], "isController": false}, {"data": ["/api/user/count-173", 20, 0, 0.0, 68.15, 39, 145, 59.5, 113.80000000000003, 143.49999999999997, 145.0, 23.06805074971165, 9.101066897347174, 15.195853157439446], "isController": false}, {"data": ["/api/user/users-182", 20, 0, 0.0, 1796.8, 1444, 2102, 1799.0, 2095.1, 2101.85, 2102.0, 9.350163627863488, 327.4173460144928, 6.06801878798504], "isController": false}, {"data": ["/api/usercontent-189", 20, 0, 0.0, 35.75, 10, 83, 28.5, 72.50000000000001, 82.5, 83.0, 47.16981132075472, 17.366229363207548, 31.57935952240566], "isController": false}, {"data": ["/api/user/search-172", 20, 0, 0.0, 76.35, 43, 166, 70.0, 108.60000000000002, 163.19999999999996, 166.0, 24.906600249066003, 20.139321295143212, 16.796145314445827], "isController": false}, {"data": ["/api/usercontent-183", 20, 0, 0.0, 69.64999999999999, 26, 178, 72.5, 118.50000000000006, 175.14999999999998, 178.0, 39.682539682539684, 14.609685019841269, 25.791713169642858], "isController": false}, {"data": ["/api/usercontent-184", 20, 0, 0.0, 117.15, 51, 216, 85.5, 201.70000000000002, 215.29999999999998, 216.0, 36.69724770642202, 16.949182912844037, 27.79350630733945], "isController": false}, {"data": ["/api/user/search-176", 20, 0, 0.0, 77.50000000000001, 15, 144, 80.5, 109.0, 142.24999999999997, 144.0, 24.96878901373283, 20.774812734082396, 16.86246683832709], "isController": false}, {"data": ["/api/user/me-185", 20, 0, 0.0, 64.75, 21, 119, 58.5, 111.90000000000005, 118.75, 119.0, 55.09641873278237, 23.49399535123967, 35.59476153581267], "isController": false}, {"data": ["/api/usercontent-170", 20, 0, 0.0, 85.45000000000002, 37, 145, 86.0, 97.0, 142.59999999999997, 145.0, 25.348542458808616, 9.33242237008872, 16.475314876425855], "isController": false}, {"data": ["/api/user/search-174", 20, 0, 0.0, 86.8, 36, 158, 86.5, 139.3, 157.1, 158.0, 23.282887077997675, 19.44030122235157, 15.70116960128056], "isController": false}, {"data": ["/api/user/me-187", 20, 0, 0.0, 56.949999999999996, 21, 87, 59.5, 83.20000000000002, 86.85, 87.0, 35.02626970227671, 14.93576236865149, 22.628543673380037], "isController": false}, {"data": ["/api/user/search-178", 20, 0, 0.0, 90.95, 15, 152, 96.0, 147.8, 151.8, 152.0, 28.129395218002813, 18.350035161744024, 18.96948619901547], "isController": false}, {"data": ["/api/user/login-188", 20, 0, 0.0, 283.84999999999997, 155, 556, 233.5, 509.8000000000002, 554.1999999999999, 556.0, 29.41176470588235, 43.36081112132353, 8.115521599264705], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 380, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
