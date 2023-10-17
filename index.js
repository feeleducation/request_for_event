$('form').submit(function (event) {
    const form = document.forms[0];
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        if (!(form.classList.contains("was-validated"))) {
            form.classList.add("was-validated");
        }
        return false;
    }
    
    const placeName = $('input[name="place-name"]').val();
    const postalCode = $('input[name="postal-code"]').val();
    const address = $('input[name="address"]').val();
    /*
    if (placeName == "" && address == ""){
        window.alert("場所の名称、住所のいずれかを入力してください。");
        return false;
    }
    */

    if (window.confirm('フォームを送信しますか？')) {
    }
    else {
        return false; // 「キャンセル」なら送信しない
    }

    let sendText = "【理科実験教室開催依頼】\n\n";

    sendText += "〈組織・団体名〉\n" + $('input[name="organization"]').val() + "\n" +
                "〈代表者・担当者様氏名〉\n" + $('input[name="name"]').val()+ "\n";
    
    const date = [$('input[name="date1"]').val(), $('input[name="date2"]').val(), $('input[name="date3"]').val()].filter(Boolean);
    if(date.length>0){
        sendText += "〈ご希望の日程〉\n";
        for(let i=0; i<date.length; i++){
            sendText += "第" + (i+1) + "希望：" + date[i] + "\n";
        }
    }

    sendText += "〈希望の開催場所〉\n";
    if(placeName) sendText += placeName + "\n";
    if(postalCode) sendText += "〒" + postalCode + "\n";
    if(address) sendText += address + "\n";

    sendText += "〈参加予定者数〉\n" + $('input[name="number"]').val() + "\n";

    const program = [$('select[name="program1"]').val(), $('select[name="program2"]').val(), $('select[name="program3"]').val()].filter(Boolean);
    if(program.length>0){
        sendText += "〈ご希望の理科実験プログラム〉\n";
        for(let i=0; i<program.length; i++){
            sendText += "第" + (i+1) + "希望：" + program[i] + "\n";
        }
    }

    const remarks = $('textarea[name="remarks"]').val();
    if(remarks) sendText += "〈備考〉\n" + remarks;

    // window.confirm(sendText);
    sendMessage(sendText);
    return false;
});

function sendMessage(sendText) {
    liff.sendMessages([
        {
            type: 'text',
            text: sendText
        }
    ])
    .then(() => {
        window.alert("回答ありがとうございました。\n内容を確認後担当者が返信しますので、しばらくお待ちください。");
        liff.closeWindow();
    })
    .catch((error) => {
        window.alert("フォームの送信に失敗しました： " + error + "\nもう1度お試しください。改善されないようでしたらチャットにてお問い合わせください。");
    });
}

const params = (new URL(document.location)).searchParams;
const key = params.get('key');



$(document).ready(function () {
    const liffId = "2001206603-R32ElVND"; //LIFF IDを入力。LINE DevelopersのLIFF画面より確認可能
    console.log("init liff, ID : ${liffId}");
    initializeLiff(liffId);
    
    // プログラムのリストを読み込んで選択肢に入れる
    let opt = document.createElement("option");
    const programList = programList();
    
    let proItems = document.getElementsByClassName("programSelect");
    for (let i=0; i < proItems.length; i++) {
        for (let j=0; j < programList.length; j++) {
            opt = document.createElement("option");
            opt.value = programList[j];  //value値
            opt.text = programList[j];   //テキスト値
            proItems[i].appendChild(opt);
        }
    }

    // 日付の入力の最小値を1か月後に設定
    let date = new Date();
    date.setMonth(date.getMonth() + 1); // 1か月後の日付
    let minDate = dateFormat(date);
    console.log("mindate: " + minDate);
    let dateItems = document.getElementsByClassName("dateInput");
    for (let i=0; i < dateItems.length; i++) {
        dateItems[i].setAttribute("min", minDate);
    }
    
})

function initializeLiff(liffId) {
    liff
        .init({
            liffId: liffId
        })
        .then(() => {
            // Webブラウザからアクセスされた場合は、LINEにログインする
            if (!liff.isInClient() && !liff.isLoggedIn()) {
                window.alert("LINEアカウントにログインしてください。");
                liff.login({ redirectUri: location.href });
            } else {
                console.log("Login Success");
            }
        })
        .catch((err) => {
            console.log("LIFF Initialization failed ", err);
        });
}

function programList() {
    return [
        "ビー玉万華鏡を作ろう！",
        "切り絵を作ろう！",
        "野菜ロケットを飛ばそう！",
        "目の不思議について学ぼう！",
        "糸電話のなぞを追え！",
        "手作りカイロであったまろう！",
        "紫いもパンケーキを作ろう！",
        "大空に飛ばそう、ペットボトルロケット！",
        "いろいろなシャボン玉であそぼう！",
        "オリジナルエコキャンドルをつくろう！",
        "スライムをつくろう！",
        "バルーン動物園をつくろう！",
        "ペットボトルのホバークラフトであそぼう！",
        "マヨネーズをつくろう！",
        "浮力の秘密を知ろう！",
        "建物の秘密について学ぼう！",
        "レンズの仕組みを学ぼう！",
        "パラシュートを作ろう！",
        "カッテージチーズを作ろう"
    ];
}

function dateFormat(date){
    let format = "YYYY-MM-DD";
    format = format.replace("YYYY", date.getFullYear());
    format = format.replace("MM", ("0"+(date.getMonth() + 1)).slice(-2));
    format = format.replace("DD", ("0"+ date.getDate()).slice(-2));
    return format;
}

function onPostalCode(field){
    convertZenkakuNumber(field);
    // nextField(field);
}

function convertZenkakuNumber(field) {
    let val = field.value;
    console.log("before:" + val);
    val = val.replace(/[０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    val = val.replace(/[-－﹣−‐⁃‑‒–—﹘―⎯⏤ーｰ─━]/g, '-');
    val = val.replace(/[^0-9\-]/g, '');

    console.log("after:" + val);
    field.value = val;
}

function nextField(field) {
    console.log(field.id);
    if (field.value.length >= field.maxLength) {
        console.log(field.value.length);
        const elm = document.forms[0].elements;
        for (let i=0; i < elm.length; i++) {
            if (elm[i] == field) {
                console.log(elm[i].id, elm[i+1].id);
                elm[i + 1].focus();
                break;
            }
        }
    }
}

function placeRequired(field, pairId){
    const pairField = document.getElementById(pairId);
    if(field.value.length > 0 || pairField.value.length > 0) {
        console.log("required remove", field.id, pairId);
        field.removeAttribute("required");
        pairField.removeAttribute("required");
    }
    else {
        console.log("required set", field.id, pairId);
        field.setAttribute("required", true);
        pairField.setAttribute("required", true);
        
    }
}