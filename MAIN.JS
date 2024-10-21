<body>
    <div class="container">

    </div>
</body>


function add_to_do(){
    let exemple = document.createElement("div");
    exemple.classList.add("exemple");

    let checkbox = document.createAttribute("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";

    let textarea = document.createAttribute("textarea");
    textarea.classList.add("textarea");

    exemple.appendChild(checkbox);
    exemple.appendChild(textarea);
    document.getElementsByClassName("container")[0].appendChild(exemple);
}
