import axios from 'axios';

export async function makeReport(report) {
  return await axios.post('/api/unyfi/auth/report', report);
}
