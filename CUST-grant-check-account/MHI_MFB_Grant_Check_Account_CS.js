/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */

define(['N/search', 'N/record', 'N/ui/dialog'], (search, record, dialog) => {
  function validateLine(context) {
    // deployed on the Journal Entry, Invoice, and Cash Sale record
    const { currentRecord } = context;
    console.log('currentRecord', currentRecord);
    // JE -> sublist name is line
    // invoice -> sublist is item

    const sublistName = context.sublistId;
    if (sublistName !== 'line' && sublistName !== 'item') { return true; }

    const lineNumber = context.line;
    console.log('lineNumber', lineNumber);
    const check = currentRecord.getCurrentSublistValue({
      sublistId: sublistName,
      fieldId: 'custcol_mfb_mhi_grant_rev_acct'
    });
    console.log('check', check);

    if (check == true) {
      const associatedGrant = currentRecord.getCurrentSublistValue({
        sublistId: sublistName,
        fieldId: 'cseg_npo_grant_segm'
      }) || '';
      console.log('associatedGrant', associatedGrant);

      if (associatedGrant == null || associatedGrant == '') {
        dialog.alert({
          title: 'Alert',
          message: 'Line utilizes a Grant Revenue Account and cannot be saved without providing an associated Grant value.'
        }).then(success).catch(failure);
        return false;
      }

      currentRecord.setCurrentSublistValue({
        sublistId: sublistName,
        fieldId: 'cseg_npo_restrictn',
        value: 2
      });
    }

    return true;
  }

  function success(result) { console.log('Success with value: ' + result); }

  function failure(reason) { console.log('Failure: ' + reason); }


  return {
    validateLine
  };
});
