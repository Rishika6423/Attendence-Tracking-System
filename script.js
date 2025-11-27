const form = document.getElementById('attendanceForm');
const recordsList = document.getElementById('records');
const summaryList = document.getElementById('summaryList');
const exportBtn = document.getElementById('exportBtn');
const attendanceRecords = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const id = document.getElementById('workerId').value.trim();
  const name = document.getElementById('workerName').value.trim();
  const date = document.getElementById('attendanceDate').value;
  const status = document.getElementById('status').value;

  if (!id || !name || !date || !status) {
    alert('Please fill in all fields.');
    return;
  }

  const record = { id, name, date, status };
  attendanceRecords.push(record);

  const listItem = document.createElement('li');
  listItem.textContent = `${id} - ${name} - ${date} - ${status}`;
  recordsList.appendChild(listItem);

  form.reset();
  updateSummary();
});

function updateSummary() {
  const summary = {};

  attendanceRecords.forEach(record => {
    if (!summary[record.name]) {
      summary[record.name] = { total: 0, present: 0 };
    }
    summary[record.name].total++;
    if (record.status === "Present") {
      summary[record.name].present++;
    }
  });

  summaryList.innerHTML = "";
  for (const name in summary) {
    const { total, present } = summary[name];
    const percent = ((present / total) * 100).toFixed(1);
    const item = document.createElement('li');
    item.textContent = `${name}: ${present}/${total} days present (${percent}%)`;
    summaryList.appendChild(item);
  }
}

exportBtn.addEventListener('click', function () {
  if (attendanceRecords.length === 0) {
    alert("No records to export.");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,ID,Name,Date,Status\n";
  attendanceRecords.forEach(record => {
    csvContent += `${record.id},${record.name},${record.date},${record.status}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "attendance_records.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});