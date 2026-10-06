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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8916666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.85, 500, 1500, "/api/user/login-169"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user/count-179"], "isController": false}, {"data": [1.0, 500, 1500, "/api/user-180"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "/api/user/count-177"], "isController": false}, {"data": [0.975, 500, 1500, "/api/user/count-175"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "/api/user/register-186"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "/api/user/count-173"], "isController": false}, {"data": [0.0, 500, 1500, "/api/user/users-182"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-189"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "/api/user/search-172"], "isController": false}, {"data": [1.0, 500, 1500, "/api/usercontent-183"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "/api/usercontent-184"], "isController": false}, {"data": [0.975, 500, 1500, "/api/user/search-176"], "isController": false}, {"data": [0.975, 500, 1500, "/api/user/me-185"], "isController": false}, {"data": [0.975, 500, 1500, "/api/usercontent-170"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "/api/user/search-174"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "/api/user/me-187"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "/api/user/search-178"], "isController": false}, {"data": [0.7416666666666667, 500, 1500, "/api/user/login-188"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1140, 0, 0.0, 438.8368421052634, 10, 4771, 232.0, 741.5000000000005, 2507.4500000000007, 4113.339999999998, 108.30324909747293, 281.4379646233137, 65.56393469147825], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/user/login-169", 60, 0, 0.0, 432.3166666666665, 126, 963, 350.5, 886.5, 937.3999999999999, 963.0, 30.832476875642346, 43.666796473535456, 8.426238919578623], "isController": false}, {"data": ["/api/user/count-179", 60, 0, 0.0, 179.63333333333338, 29, 486, 182.5, 312.59999999999997, 337.75, 486.0, 50.04170141784821, 19.743015012510423, 33.02801162427022], "isController": false}, {"data": ["/api/user-180", 60, 0, 0.0, 145.65, 14, 333, 137.5, 281.2, 300.24999999999994, 333.0, 61.53846153846154, 247.4499198717949, 39.59435096153846], "isController": false}, {"data": ["/api/user/count-177", 60, 0, 0.0, 256.99999999999994, 55, 591, 240.0, 469.79999999999995, 564.4499999999999, 591.0, 36.92307692307693, 14.567307692307692, 24.369591346153847], "isController": false}, {"data": ["/api/user/count-175", 60, 0, 0.0, 224.99999999999997, 60, 553, 196.5, 437.3, 535.6999999999996, 553.0, 46.26060138781804, 18.25125289128759, 30.487272311102547], "isController": false}, {"data": ["/api/user/register-186", 60, 0, 0.0, 665.3333333333334, 129, 1432, 571.5, 1230.5, 1389.45, 1432.0, 32.0, 14.3078125, 9.6515625], "isController": false}, {"data": ["/api/user/count-173", 60, 0, 0.0, 207.6166666666667, 38, 576, 207.0, 353.0, 422.94999999999993, 576.0, 77.92207792207792, 30.742694805194805, 51.353236607142854], "isController": false}, {"data": ["/api/user/users-182", 60, 0, 0.0, 3468.9999999999995, 2439, 4771, 3457.5, 4277.2, 4428.15, 4771.0, 12.224938875305625, 426.4758668882437, 7.9372564562958425], "isController": false}, {"data": ["/api/usercontent-189", 60, 0, 0.0, 77.30000000000001, 10, 406, 35.5, 217.89999999999998, 290.8499999999998, 406.0, 36.809815950920246, 13.552051380368098, 24.654308857361965], "isController": false}, {"data": ["/api/user/search-172", 60, 0, 0.0, 277.0333333333333, 53, 654, 255.5, 472.5, 520.65, 654.0, 71.8562874251497, 58.102544910179645, 48.478433757485035], "isController": false}, {"data": ["/api/usercontent-183", 60, 0, 0.0, 151.78333333333333, 27, 369, 131.5, 317.6, 354.0499999999999, 369.0, 31.007751937984494, 11.41593992248062, 20.162609011627907], "isController": false}, {"data": ["/api/usercontent-184", 60, 0, 0.0, 367.6833333333334, 33, 839, 288.0, 755.5, 764.75, 839.0, 26.223776223776223, 12.145569274475525, 19.86886404611014], "isController": false}, {"data": ["/api/user/search-176", 60, 0, 0.0, 237.41666666666677, 61, 631, 217.5, 386.09999999999997, 506.64999999999964, 631.0, 40.187541862022776, 33.43729068988613, 27.15210042699263], "isController": false}, {"data": ["/api/user/me-185", 60, 0, 0.0, 270.08333333333337, 14, 676, 289.0, 481.9, 589.1999999999996, 676.0, 36.78724708767627, 15.719003870324954, 23.776991684549355], "isController": false}, {"data": ["/api/usercontent-170", 60, 0, 0.0, 261.55, 128, 550, 232.5, 460.9, 508.24999999999983, 550.0, 102.21465076660988, 37.631761073253834, 66.46447774701875], "isController": false}, {"data": ["/api/user/search-174", 60, 0, 0.0, 209.11666666666667, 46, 608, 170.5, 392.0, 488.39999999999986, 608.0, 61.09979633401222, 51.015943228105904, 41.22147880600815], "isController": false}, {"data": ["/api/user/me-187", 60, 0, 0.0, 165.6666666666667, 13, 598, 74.5, 359.9, 583.4999999999998, 598.0, 34.46295232624928, 14.725844521826536, 22.274711911257896], "isController": false}, {"data": ["/api/user/search-178", 60, 0, 0.0, 198.64999999999998, 43, 513, 188.0, 353.0, 409.54999999999995, 513.0, 40.67796610169491, 26.53601694915254, 27.443723516949152], "isController": false}, {"data": ["/api/user/login-188", 60, 0, 0.0, 540.0666666666667, 118, 1192, 518.5, 986.7, 1118.0499999999997, 1192.0, 29.895366218236173, 44.100044375934225, 8.257719076980568], "isController": false}]}, function(index, item){
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
