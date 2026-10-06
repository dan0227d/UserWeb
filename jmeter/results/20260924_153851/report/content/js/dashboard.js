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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9021929824561403, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8583333333333333, 500, 1500, "/api/user/login-169"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-179"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user-180"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "/api/user/count-177"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "/api/user/count-175"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "/api/user/register-186"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-173"], "isController": false}, {"data": [0.0, 500, 1500, "/api/user/users-182"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-189"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "/api/user/search-172"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "/api/usercontent-183"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "/api/usercontent-184"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "/api/user/search-176"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/me-185"], "isController": false}, {"data": [0.875, 500, 1500, "/api/usercontent-170"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/search-174"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "/api/user/me-187"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/search-178"], "isController": false}, {"data": [0.7416666666666667, 500, 1500, "/api/user/login-188"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1140, 0, 0.0, 420.49210526315784, 8, 4609, 215.5, 632.9000000000001, 2472.8500000000004, 4238.129999999999, 110.98130841121495, 281.9021825107087, 67.18516126971379], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/user/login-169", 60, 0, 0.0, 404.8999999999999, 166, 917, 289.5, 870.4, 903.0, 917.0, 30.075187969924812, 42.59427866541353, 8.219278665413533], "isController": false}, {"data": ["/api/user/count-179", 60, 0, 0.0, 165.14999999999998, 35, 413, 141.5, 297.8, 337.8499999999999, 413.0, 53.003533568904594, 20.911550353356894, 34.982849768109546], "isController": false}, {"data": ["/api/user-180", 60, 0, 0.0, 147.0333333333334, 23, 438, 123.5, 279.4, 332.5499999999999, 438.0, 56.98005698005698, 210.27532941595442, 36.66143607549858], "isController": false}, {"data": ["/api/user/count-177", 60, 0, 0.0, 223.98333333333338, 35, 683, 242.5, 371.3, 402.7, 683.0, 41.0958904109589, 16.21361301369863, 27.123688998287673], "isController": false}, {"data": ["/api/user/count-175", 60, 0, 0.0, 230.76666666666668, 36, 546, 228.5, 376.9, 423.0499999999999, 546.0, 47.3186119873817, 18.668671135646687, 31.184536425473187], "isController": false}, {"data": ["/api/user/register-186", 60, 0, 0.0, 533.3833333333334, 127, 1065, 529.5, 843.6999999999999, 868.4499999999999, 1065.0, 20.768431983385256, 9.28596346053998, 6.263994353582555], "isController": false}, {"data": ["/api/user/count-173", 60, 0, 0.0, 221.50000000000003, 63, 408, 198.0, 365.9, 391.34999999999997, 408.0, 62.69592476489028, 24.73550156739812, 41.31869612068966], "isController": false}, {"data": ["/api/user/users-182", 60, 0, 0.0, 3638.8666666666672, 2172, 4609, 3732.0, 4323.1, 4439.849999999999, 4609.0, 12.232415902140673, 417.1801334734964, 7.942111047400611], "isController": false}, {"data": ["/api/usercontent-189", 60, 0, 0.0, 79.06666666666666, 11, 438, 43.0, 228.29999999999998, 308.4499999999999, 438.0, 22.5140712945591, 8.288871951219512, 15.07937089587242], "isController": false}, {"data": ["/api/user/search-172", 60, 0, 0.0, 223.61666666666665, 68, 522, 200.0, 398.0, 442.75, 522.0, 78.02340702210664, 63.08923927178153, 52.639131583224966], "isController": false}, {"data": ["/api/usercontent-183", 60, 0, 0.0, 145.71666666666673, 16, 512, 109.5, 317.0, 353.7999999999999, 512.0, 28.116213683223993, 10.351379451733834, 18.282403204076854], "isController": false}, {"data": ["/api/usercontent-184", 60, 0, 0.0, 191.0, 59, 539, 181.0, 351.09999999999997, 386.84999999999997, 539.0, 25.651988029072253, 11.881580002137666, 19.43563956284737], "isController": false}, {"data": ["/api/user/search-176", 60, 0, 0.0, 251.51666666666665, 29, 601, 240.5, 412.9, 447.59999999999997, 601.0, 45.42013626040878, 37.79097274791825, 30.68742311695685], "isController": false}, {"data": ["/api/user/me-185", 60, 0, 0.0, 151.4, 23, 409, 110.0, 289.0, 320.8999999999999, 409.0, 27.039206849932402, 11.55371577850383, 17.47646391955836], "isController": false}, {"data": ["/api/usercontent-170", 60, 0, 0.0, 332.4666666666666, 143, 684, 253.0, 604.0, 619.6999999999999, 684.0, 87.71929824561403, 32.29509320175438, 57.03895970394736], "isController": false}, {"data": ["/api/user/search-174", 60, 0, 0.0, 229.18333333333325, 74, 483, 207.5, 398.79999999999995, 430.65, 483.0, 50.97706032285471, 42.56385407816482, 34.39209191801189], "isController": false}, {"data": ["/api/user/me-187", 60, 0, 0.0, 106.94999999999999, 8, 568, 75.5, 218.7, 342.49999999999994, 568.0, 22.371364653243848, 9.559170511744966, 14.459460640380314], "isController": false}, {"data": ["/api/user/search-178", 60, 0, 0.0, 218.91666666666666, 35, 437, 229.0, 370.0, 393.34999999999997, 437.0, 41.293874741913285, 26.937801101169992, 27.859251333448036], "isController": false}, {"data": ["/api/user/login-188", 60, 0, 0.0, 493.93333333333317, 110, 1195, 511.0, 765.9, 937.1499999999997, 1195.0, 20.682523267838675, 30.50975148655636, 5.712941119441572], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1140, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
