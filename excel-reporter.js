const XLSX = require('xlsx');

class ExcelReporter {
  constructor(options) {
    this.outputFile = options.outputFile || 'test-report.xlsx';
    this.data = [];
  }

  onTestEnd(test, result) {
    this.data.push({
      title: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error ? result.error.message : 'N/A',
    });
  }

  onEnd() {
    const worksheet = XLSX.utils.json_to_sheet(this.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Results');
    XLSX.writeFile(workbook, this.outputFile);
  }
}

module.exports = ExcelReporter;
