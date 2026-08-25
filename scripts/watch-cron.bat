@echo off
cd /d C:\Users\Saikat\masaRepo\assam-jobs-repository
if not exist logs mkdir logs
rem Firebase admin service account (enables Firestore writes):
set FIREBASE_SERVICE_ACCOUNT_PATH=C:\Users\Saikat\Downloads\assamjobs-masum98-firebase-adminsdk-fbsvc-d6312d99d7.json
node scripts\watchCron.mjs >> logs\watch.log 2>&1
