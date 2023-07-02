document.getElementById('torrentForm').addEventListener('submit', function(event) {
  event.preventDefault();

  var magnetInput = document.getElementById('torrentInput').value.trim();
  var fileInput = document.getElementById('torrentFileInput').files[0];

  var client = new WebTorrent();

  if (fileInput) {
    var reader = new FileReader();

    reader.onload = function(event) {
      var torrentData = new Uint8Array(event.target.result);

      client.add(torrentData, function(torrent) {
        processTorrent(torrent);
      });
    };

    reader.readAsArrayBuffer(fileInput);
  } else if (magnetInput) {
    client.add(magnetInput, function(torrent) {
      processTorrent(torrent);
    });
  }
});

document.getElementById('torrentInput').addEventListener('paste', function(event) {
  var clipboardData = event.clipboardData || window.clipboardData;
  var magnetLink = clipboardData.getData('Text');

  document.getElementById('torrentInput').value = magnetLink;
});

function processTorrent(torrent) {
  torrent.files.forEach(function(file) {
    var li = document.createElement('li');
    li.textContent = file.name;

    document.getElementById('fileList').appendChild(li);

    file.getBlobURL(function(err, url) {
      if (err) throw err;

      var a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.textContent = 'Download';

      li.appendChild(a);
    });
  });
}
