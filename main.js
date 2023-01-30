console.log("works")

const client_id = "1063326802781-9uksba5jmgtirgfuk3hbqge8ah2etd4b.apps.googleusercontent.com"
const client_secret = "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"

const token = "ya29.a0AVvZVsrpcv2s9PPqMjby2sJ_3wkDX8G-qsKs-Ivg-UKbWpI7kpQ17FQXeTeZl8sTMbWNRAxG6UYdazq8ucAimBKNz-Wao-TtUNR7E31ypAEW7UDMWzjR0sdFvbJ9Ls0C4X70lkAto7eVm7kY1P2brdp7X6pAUtIaCgYKAVkSAQASFQGbdwaI9XRxri1EA-OHh4ol1sMjQw0166";
const sheet_id = "10mBcZbKhQ3Trrd3dzBJ4VXAHzPNO8AWdvesdYCzDFSM";

GetResult()
function GetResult(){
    // const url = "https://script.googleusercontent.com/macros/echo?user_content_key=12EZQXn21BKF3ihIsyKjuBbzleu6tWTU2Smzi9EpkQq26Fr_gS82XvrV57PrUVWyCsO474djt1ypcLx71CV9DTqg3tUYrkKBm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnAtrOzoJSlOEwDWTZnTrUZSQ_jU-CXKifmWx1YIBgW4n1z6JEB349zcBXLVLcDh4hB7f8n0CRUqr9z0Eru82ebdLOreOWKmdpdz9Jw9Md8uu&lib=MEri0jBPIUE_ACIAF2475nM1Ir1lfMhIO";

    // fetch(url,{
        
    // }).then(d => d.json()).then(d => {
    //     document.getElementById("app").textContent = d[0].status;
    // })
    var data = getSheet();
}

var yearly_pass = []
var yearly_fail = []

function MakeChart(year,n_pass,n_fail){
    console.log(year,n_pass,n_fail);
    const ctx = document.getElementById(`Chart${year}`);

    yearly_pass.push(n_pass);
    yearly_fail.push(n_fail);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Pass', 'Fail'],
            datasets: [{
            label: '# of Votes',
            data: [n_pass,n_fail],
            borderWidth: 1
            }]
        },
        options: {
            scales: {
            y: {
                beginAtZero: true
            }
            }
        }
        });
}

async function getSheet(){
    const request = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values/B1:C25`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`  
    }
    });
    const data = await request.json();
    console.log(data.values);

    var no_pass = 0
    var no_fail = 0
    var year = ""
    var years = []

    for(let i=0;i<data.values.length;i++){
        if(data.values[i][0] == "Year"){
            console.log(data.values[i][1]);
            if(year != ""){
                MakeChart(year,no_pass,no_fail);
                years.push(year);
            }
            no_pass = 0
            no_fail = 0
            year = data.values[i][1]
        }
        if(data.values[i][1] == "Pass"){
            no_pass++;
        }else if(data.values[i][1] == "Fail"){
            no_fail++;
        }
    }

    // var no_pass = 0
    // var no_fail = 0
    // for(let i=0;i<data.values.length;i++){
    //     if(data.values[i][1] == "Pass"){
    //         no_pass++;
    //     }else if(data.values[i][1] == "Fail"){
    //         no_fail++;
    //     }
        
    // }

//     const ctx1 = document.getElementById('Chart2021');

//   new Chart(ctx1, {
//     type: 'pie',
//     data: {
//       labels: ['Pass', 'Fail'],
//       datasets: [{
//         label: '# of Votes',
//         data: [no_pass,no_fail],
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   });

//   const ctx2 = document.getElementById('myChart1');

//   new Chart(ctx2, {
//     type: 'pie',
//     data: {
//       labels: ['Pass', 'Fail'],
//       datasets: [{
//         label: '# of Votes',
//         data: [no_pass,no_fail],
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   });

    const ctxyear = document.getElementById('ChartYear');   
    new Chart(ctxyear, {
        type: 'line',
        data: {
            datasets: [{
                type: 'line',
                label: 'No. of Students Passed',
                data: yearly_pass
            }, {
                type: 'line',
                label: 'No. of Students Failed',
                data: yearly_fail,
            }],
            labels: years
        },
        options: {
            scales: {
            y: {
                beginAtZero: true
            }
            }
        }
        });

    return data;
}

