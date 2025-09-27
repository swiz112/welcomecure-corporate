const ExcelJS = require('exceljs');
const path = require('path');

class ExcelReporter {
  constructor(options) {
    this.results = [];
  }

  onBegin(config, suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  onTestEnd(test, result) {
    const emptyColumnsAnnotation = test.annotations.find(a => a.type === 'empty-columns');
    const emptyColumns = emptyColumnsAnnotation ? JSON.parse(emptyColumnsAnnotation.description) : [];

    const missingHeadersAnnotation = test.annotations.find(a => a.type === 'missing-headers');
    const missingHeaders = missingHeadersAnnotation ? JSON.parse(missingHeadersAnnotation.description) : [];

    this.results.push({
      test: test.title,
      status: result.status,
      duration: result.duration,
      errors: result.errors.map(error => error.message).join('\n'),
      testFile: test.location.file,
      testLine: test.location.line,
      errorStack: result.errors.map(error => error.stack).join('\n\n'),
      emptyColumns: emptyColumns.join(', '),
      missingHeaders: missingHeaders.join(', '),
    });
  }

  async onEnd(result) {
    console.log(`Finished the run: ${result.status}`);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test Results');

    // Define columns
    worksheet.columns = [
      { header: 'Test Name', key: 'test', width: 50 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Duration (ms)', key: 'duration', width: 15 },
      { header: 'Test File', key: 'testFile', width: 40 },
      { header: 'Line', key: 'testLine', width: 10 },
      { header: 'Errors', key: 'errors', width: 100, style: { alignment: { wrapText: true } } },
      { header: 'Error Stack', key: 'errorStack', width: 120, style: { alignment: { wrapText: true } } },
      { header: 'Empty Columns', key: 'emptyColumns', width: 50, style: { alignment: { wrapText: true } } },
      { header: 'Missing Headers', key: 'missingHeaders', width: 50, style: { alignment: { wrapText: true } } },
    ];

    // Add rows
    this.results.forEach(row => {
      worksheet.addRow(row);
    });

    // Save to file
    const filePath = path.join(process.cwd(), 'test-report.xlsx');
    await workbook.xlsx.writeFile(filePath);
    console.log(`Excel report generated at: ${filePath}`);
  }
}

module.exports = ExcelReporter;
