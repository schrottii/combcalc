class Game {
    constructor(name, image, contents) {
        this.name = name;
        this.image = image;
        this.contents = contents;
    }

    isSelected() {
        return games[selected[0]].name == this.name;
    }

    onClick(nr) {
        selected[0] = nr;
        selected[1] = "";

        if (this.contents.length == 1) selected[1] = this.contents[0];

        renderGames();
        renderCategories();
        renderTools();
    }

    render(nr) {
        return "<div class='navButton'"
            + (this.isSelected() ? " style='background-image: url(images/button_selected.png);'" : "")
            + " onclick='clickGame(" + nr + ")'"
            + ">" + (this.image != "" ? "<img style='float: left;' src='images/" + this.image + "' height='32' />" : "")
            + this.name + "</div>";
    }
}

class Category {
    constructor(id, name, image, contents) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.contents = contents;
    }

    isSelected() {
        return selected[1] == this.id;
    }

    onClick() {
        if (selected[1] != this.id) selected[1] = this.id;
        else selected[1] = "";
        renderCategories();
        renderTools();
    }

    render() {
        return "<div class='navButtonMini'"
            + (this.isSelected() ? " style='background-image: url(images/button_selected.png);'" : "")
            + " onclick='clickCategory(`" + this.id + "`)'"
            + ">" + (this.image != "" ? "<img style='float: left;' src='images/" + this.image + "' height='32' />" : "")
            + this.name + "</div>";
    }
}

var selected = [0, ""];

function clickGame(nr) {
    games[nr].onClick(nr);
}

function renderGames() {
    let render = "";

    for (let game in games) {
        render += games[game].render(game);
    }

    document.getElementById("gamesSelection").innerHTML = render;
}

function clickCategory(nr) {
    categories[nr].onClick();
}

function renderCategories() {
    let render = "";
    let cats = games[selected[0]].contents;

    for (let cat in cats) {
        render += categories[cats[cat]].render(cat);
    }

    document.getElementById("categoriesSelection").innerHTML = render;
}