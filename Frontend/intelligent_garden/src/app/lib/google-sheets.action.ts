'use server';
import { google } from "googleapis";

export async function appendData(humidity: number, light: number, soilMoisture: number, temperature: number, pumpState: string, timestamp: string, pot: string) { 
  const glAuth = await google.auth.getClient({
        projectId: "YOUR_PROJECT_ID",
        credentials: {
            "type": "service_account",
            "project_id": "embeded-7133f",
            "private_key_id": "e5f979e637e49e38818c02e105081f6d6c017893",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQClrpcuLN/OB6iH\ndAWZsWPSbHbqBzsx8qa4uJbzavd+YJkP3WazXsGbN1LDr0aB0G9o6Y0kRk2ZVcEF\nA6Gmt+1Q8YfXERvoBNO4ontWbGmlvQ0DCrtS/V5Rg770IS5+2LYVZ6EqekSTLXNH\nzRNlyynT/w4cFLq3ydaD0nIldRlZFPid49SstgJ+IKzv8JEPDa8xcL4ebtSJwiss\nA0ycxXgttK9GB5Hqk29ICPU0YkgqW2ImbNDK39SlfFBslCR0ifjbl4VYcXElH9yv\nclJ3mlIrusUwhjCTG6ZfS+YpzrR+JnOusLDbwu9cCIyh9tZqOJKGxvETiXgjH7CB\n4n+fue7BAgMBAAECggEAERjqOvaghddeedPsPAcFQRK2VsI2Rpo+wDM0SJxSO/Vl\n9jAnx/zQR982qEDvKrhCtvXa/dJPcbJav9S3GshCMicqmHQIiDHvU09ZIPsBD/xp\nWlYCLLc+w3SwAOtnq+lbKOxPwl1ptDJtggxUox2LDHh2kUlGV275txLBesIRwpJv\nttGQZ0O5IAeWRx8HaOCsDHzGkrlI8cmfu8ic0A3CWceLFbAdl5EI760xHhCWT46f\nmugA8KLYWnKxctsytsWrep1soXQKgKj3SJ7cZU95jYdKrmVVhcMMlatOTwa3Ps32\n+EboE5J23+ZERH6KqVS77lwjBvsDjpbdUfF82stcnQKBgQDkLsrEDgA6uOZoDcYI\nxE9j2dNFzPKed0gM2dz4YbSK3VSxVfVp4MkpfXpULpz0+UjxhvIsMIAoGRQL/lGg\nOp/vqcWQHFSVHCV0HFWisC3GucBptzLohMyyoAZ6jlQVB6k0nap+DuFoTGQyrniB\nzsqc9HXdK3frfiaaqx9Y0HulIwKBgQC54UCJh2z5Z7Qk6KCdHVq+Xx3dewPtRy9N\nF4CV/nrJXv2A5oY9s8Oqy0WBN16T4IX2Eprcme14ytM+bdtYbnCOWcvuFdFh21j3\nrLurMTplBjdeUyGLshOpQ1gyP1gD1FGl8R5pNwAYjeoSAGiY0rfDQuYDxtUAhw2a\n5koRQq/UywKBgCmmCMiELbKKMTPo366V9k+pYJCq+dXGu9XsphKH8uYtw9micOrk\nZpM2He/jmi50mcXL9cPvDlVDTo9p2gg+6xZZjH/jS+TzgDqTOWY6dgCBwwcIszgR\nlTM9VjFkbSBxh4bdCFN979KTru45PjGjRwQi8qht2LOZEP7GITCazRa1AoGAEAzm\nQLnj7AlLYeCAdfCh9ExMTOKhbSy3ZeXAobMOsTK1mxrMvqk2HRpeTxET5pr9lkj2\n/FOCUOraoMplpVYr++6/EDjsEpIZNZHBxr+CdlS6FTgCboia8AOzqusTU4lS34xZ\nfuZT6MrgSlukrIWNfpvZNrxFij0fLJ/0B1eFzU8CgYBWLr6LgFzpvoJ1+3w+vIx/\nGc6FD406hWtjzMJzeKwv/6mgN35Sw6n/agsnFx0EmbvD1Q4NatBFu9VTsZoxG2p0\nfC/J9XDkdGVKCQr2jsqVsP2yY562jUdBk/1unrAKevLdMv0EIdNU7pXVI8MDfyRh\n4M1GKR9VZAfbu5491Uq2vg==\n-----END PRIVATE KEY-----\n",
            "client_email": "intelligent-garden@embeded-7133f.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com"
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const glSheets = google.sheets({ version: "v4", auth: glAuth });

    await glSheets.spreadsheets.values.append({
        auth: glAuth,
        spreadsheetId: "1DXcgeu72sJyaVlrfi1bIDIXk3WaRQAOX5Sfr8Y2USpo",
        range: "A2:G2",
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [
                [
                    pot, timestamp, humidity, light, soilMoisture, temperature, pumpState
                ],
            ]
        }
    })
}