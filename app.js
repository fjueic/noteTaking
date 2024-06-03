const express = require("express");
const bodyParser = require("body-parser");
const markdownit = require("markdown-it");
const app = express();
const server = require("http").createServer(app);
const fs = require("fs");
let markdown_content = "";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/Attachments", express.static(__dirname + "/Attachments"));
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});
app.get("/edit/:markdown_file", (req, res) => {
	let markdown_file = req.params.markdown_file;
	let content = fs.readFileSync(markdown_file, "utf8");
	res.send(editor(content, markdown_file));
});
function save(filename, content) {
	try {
		fs.writeFileSync(filename, content, "utf8");
	} catch (err) {
		console.log(err);
	}
}
app.post("/edit/save/:markdown_file", (req, res) => {
	let content = req.body.content;
	let markdown_file = req.params.markdown_file;
	save(markdown_file, content);
	res.send("ok");
});

function editor(content, markdown_file) {
	return `
        <html>
        <body>
            <button onclick="update()">Update</button>
            <button onclick="window.location.href = '/${markdown_file}'">Discard and render</button>
<textarea style="width: 100%; height: 95%;" id="editor">${content}</textarea>
            <script>
                function update() {
                    let text = document.getElementById("editor").value;
                    fetch("/edit/save/${markdown_file}", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ content: text }),
                    }).then(() => {
                        alert("Saved");
                    });
                }
            </script>
        </body>
        </html>
        `;
}
app.get("/:markdown_file", (req, res) => {
	let markdown_file = req.params.markdown_file;
	fs.readFile(markdown_file, "utf8", (err, data) => {
		if (err) {
			res.send("Error reading file");
		} else {
			let editButton = `<button>Editor</button> `;
			content = editButton + md_to_html(data);
			content =
				content +
				`
            <script>
                function editor() {
                    if(location.pathname !== '/')window.open(location.origin + '/edit' + location.pathname);
            }
document.querySelector('button').addEventListener('click', editor);
            </script>
                `;
			res.send(content);
		}
	});
});

app.post("/markdown_update", (req, res) => {
	let { text } = req.body;
	markdown_content = text;
	send_html(text);
	res.send("ok");
});
app.post("/line_number_update", (req, res) => {
	let { line_number } = req.body;
	scroll_to_line(line_number);
	res.send("ok");
});
const io = require("socket.io")(server); // Attach Socket.IO to the HTTP server
function scroll_to_line(line_number) {
	let t = markdown_content.split("\n");
	t[line_number] = t[line_number] + "<span id='empty-tag-for-scroll'></span>";
	t = t.join("\n");
	send_html(t);
}
function md_to_html(markd) {
	const md = markdownit({
		html: true,
		linkify: true,
		typographer: true,
		images: true,
	});
	return md.render(markd);
}
function send_html(content) {
	text = md_to_html(content);
	io.emit("html", text);
}
io.on("connection", function (socket) {
	console.log("Client connected");
	if (markdown_content != "") {
		send_html(markdown_content);
	}
});
port = 9876;
server.listen(port, () => {
	console.log("Server listening on port 9876");
});
