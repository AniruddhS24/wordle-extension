export function getData() {
    const board = document.getElementsByClassName("Board-module_board__jeoPS")[0];
    const rows = board.getElementsByClassName("Row-module_row__pwpBq");
    let guesses = "";
    let colorings = "";
    let num_guesses = 0;
    for(let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const children = row.children;
        var guess = "";
        var coloring = "";
        var bad = false;
        for(let j = 0; j < children.length; j++) {
            const item = children[j].children[0].getAttribute("aria-label");
            const parts = item.split(" ");
            guess += parts[0];
            if(parts[1] === "present")
                coloring += "Y";
            else if(parts[1] === "correct")
                coloring += "G";
            else if(parts[1] === "absent")
                coloring += "X";
            else {
                bad = true;
                break;
            }
        }
        if(bad)
            break;
        num_guesses++;
        guesses += guess + " ";
        colorings += coloring + " ";
    }
    
    return {"num_guesses": num_guesses, "guesses": guesses, "colors": colorings};
}