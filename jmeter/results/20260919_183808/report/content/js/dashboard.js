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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8931578947368422, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.87, 500, 1500, "/api/user/login-169"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-179"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user-180"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-177"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-175"], "isController": false}, {"data": [0.48, 500, 1500, "/api/user/register-186"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-173"], "isController": false}, {"data": [0.0, 500, 1500, "/api/user/users-182"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-189"], "isController": false}, {"data": [0.99, 500, 1500, "/api/user/search-172"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-183"], "isController": false}, {"data": [0.78, 500, 1500, "/api/usercontent-184"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/search-176"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/me-185"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-170"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/search-174"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/me-187"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/search-178"], "isController": false}, {"data": [0.85, 500, 1500, "/api/user/login-188"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 950, 0, 0.0, 433.77894736842114, 10, 4222, 189.0, 1030.9, 2241.999999999996, 3865.86, 91.76084226794167, 246.42596801651695, 55.54690895754854], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/user/login-169", 50, 0, 0.0, 339.46000000000004, 107, 862, 200.5, 837.8, 851.9, 862.0, 25.92016588906169, 36.70589116770347, 7.082989081130119], "isController": false}, {"data": ["/api/user/count-179", 50, 0, 0.0, 161.05999999999995, 85, 298, 146.0, 255.5, 273.04999999999995, 298.0, 62.5782227784731, 24.68906445556946, 41.300404802878596], "isController": false}, {"data": ["/api/user-180", 50, 0, 0.0, 140.92000000000007, 28, 314, 135.5, 231.5, 276.74999999999983, 314.0, 69.83240223463687, 320.27158257681566, 44.92869457053073], "isController": false}, {"data": ["/api/user/count-177", 50, 0, 0.0, 155.67999999999998, 45, 328, 140.5, 238.8, 266.74999999999994, 328.0, 46.948356807511736, 18.522593896713616, 30.98499853286385], "isController": false}, {"data": ["/api/user/count-175", 50, 0, 0.0, 172.40000000000006, 33, 441, 163.5, 307.0, 334.04999999999995, 441.0, 54.88474204171241, 21.653745883644348, 36.16925939901207], "isController": false}, {"data": ["/api/user/register-186", 50, 0, 0.0, 1066.8999999999996, 302, 1720, 1179.0, 1538.3, 1645.6999999999996, 1720.0, 25.31645569620253, 11.318730221518987, 7.634988132911392], "isController": false}, {"data": ["/api/user/count-173", 50, 0, 0.0, 171.49999999999997, 26, 474, 145.0, 294.6, 369.49999999999994, 474.0, 69.06077348066299, 27.24663328729282, 45.51131949240332], "isController": false}, {"data": ["/api/user/users-182", 50, 0, 0.0, 3395.18, 2087, 4222, 3580.5, 4020.9, 4149.55, 4222.0, 11.633317822242903, 418.478616507678, 7.5527952681479755], "isController": false}, {"data": ["/api/usercontent-189", 50, 0, 0.0, 74.86000000000001, 10, 205, 71.0, 139.5, 170.94999999999987, 205.0, 35.816618911174785, 13.186391923352437, 23.98804060709169], "isController": false}, {"data": ["/api/user/search-172", 50, 0, 0.0, 255.29999999999993, 60, 525, 267.0, 427.09999999999997, 478.14999999999986, 525.0, 84.31703204047218, 68.17822512647555, 56.882707103709954], "isController": false}, {"data": ["/api/usercontent-183", 50, 0, 0.0, 188.01999999999995, 16, 401, 201.0, 342.09999999999997, 378.3499999999999, 401.0, 24.91280518186348, 9.171999564025908, 16.198675728699552], "isController": false}, {"data": ["/api/usercontent-184", 50, 0, 0.0, 590.7799999999999, 135, 1903, 325.0, 1728.1, 1745.4499999999998, 1903.0, 23.507287259050308, 10.884516778326283, 17.809983985660555], "isController": false}, {"data": ["/api/user/search-176", 50, 0, 0.0, 181.45999999999995, 49, 413, 170.0, 275.59999999999997, 324.0499999999997, 413.0, 52.576235541535226, 43.74507097791798, 35.52079225814932], "isController": false}, {"data": ["/api/user/me-185", 50, 0, 0.0, 238.64000000000004, 107, 387, 253.0, 337.2, 374.0999999999999, 387.0, 67.47638326585695, 28.826385374493928, 43.61056637989204], "isController": false}, {"data": ["/api/usercontent-170", 50, 0, 0.0, 202.04000000000002, 122, 463, 181.0, 296.0, 348.94999999999993, 463.0, 104.60251046025104, 38.510885198744774, 68.01410499476988], "isController": false}, {"data": ["/api/user/search-174", 50, 0, 0.0, 187.14000000000001, 51, 416, 216.5, 314.3, 365.89999999999964, 416.0, 64.02048655569783, 53.4546054737516, 43.19007082266325], "isController": false}, {"data": ["/api/user/me-187", 50, 0, 0.0, 103.58000000000003, 16, 374, 73.0, 229.7, 296.25, 374.0, 28.49002849002849, 12.171140491452991, 18.41335024928775], "isController": false}, {"data": ["/api/user/search-178", 50, 0, 0.0, 147.08, 56, 303, 132.5, 244.39999999999998, 268.84999999999985, 303.0, 51.975051975051976, 33.905600311850314, 35.06387246621622], "isController": false}, {"data": ["/api/user/login-188", 50, 0, 0.0, 469.80000000000007, 109, 1310, 389.0, 1030.9, 1141.3999999999999, 1310.0, 29.55082742316785, 43.5892019429669, 8.161684581855793], "isController": false}]}, function(index, item){
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
