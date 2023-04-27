import { getData } from "./content.js";



function setLoading(val) {
    if(val) {
        document.getElementById("message").innerText = "Loading... this could take a while :)";
        document.getElementById("content").innerHTML = "<div class='spinner-border mx-auto' role='status'><span class='sr-only'></span></div>"
    } else {
        document.getElementById("message").innerText = "";
        document.getElementById("content").innerHTML = "";
    }
}

function setWrongPage() {
    document.getElementById("message").innerHTML = "This extension only works on <a class='link-dark' target='_blank' href='https://www.nytimes.com/games/wordle/index.html'>Wordle</a>";
    document.getElementById("content").innerHTML = "";
}

async function main() {
    
    const tabs = await chrome.tabs.query({active: true});
    const url = tabs[0].url;
    console.log(url);
    if(url === "https://www.nytimes.com/games/wordle/index.html") {
        setLoading(true);
        const results = await chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: getData
        });
        const game_data =  results[0].result;
        fetch("https://cuda-wordle-app.herokuapp.com/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(game_data)
            })
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                const items = data["distribution"];
                const content = document.getElementById("content");
                document.getElementById("message").innerText = "Potential Words: " + data["dictionary_size"];

                const div = document.createElement("div");
                div.innerHTML = `<div class='d-flex flex-row justify-content-between'><span class='fw-bold'>Word</span><div class='text-center'><span class='fw-bold'>Entropy</span></div></div><hr>`
                content.appendChild(div);
                for(var i = 0; i < items.length; i++) {
                    if(items[i] === "") continue;
                    const parts = items[i].split(" ");
                    const entropy = parseFloat(parts[0]).toFixed(2);
                    const word = parts[1];
                    const log_dict_size = Math.log2(data["dictionary_size"]);
                    let proportion = (log_dict_size === 0) ? 100 : (entropy/log_dict_size)*100;
                    proportion = Math.min(100, proportion);
                    proportion = proportion.toFixed(2);
                    
                    const div = document.createElement("div");
                    div.innerHTML = `<div class='d-flex flex-row justify-content-between'><span class='fw-light'>${word}</span><div class='text-center'><span class='badge text-bg-secondary'>${entropy}</span></div></div><div class='progress my-2' role='progressbar'><div class='progress-bar' style='width: ${proportion}%'></div></div>`
                    content.appendChild(div);
                }

                
            });
        

    } else {
        setWrongPage();
    }
}

main();