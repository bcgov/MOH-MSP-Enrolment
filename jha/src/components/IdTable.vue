<template>
  <table class="table table-sm">
    <thead>
      <tr class="border-br row bg-primary text-light text-center">
        <th class="col-sm-4 border-tl">Canadian Citizens</th>
        <th class="col-sm-4 border-tl">Permanent Residents</th>
        <th class="col-sm-4 border-tl">Temporary Document Holders</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-br row">
        <td class="col-sm-4 border-l">
          <ul>
            <li>Canadian birth certificate&nbsp;</li>
            <li>Canadian Citizenship Card (front and back)&nbsp;</li>
            <li>Certificate of Canadian Citizenship (front and back)&nbsp;</li>
            <li>Canadian passport&nbsp;</li>
            <li>First Nations status card&nbsp;</li>
            <li>Métis status card&nbsp;</li>
          </ul>
        </td>
        <td class="col-sm-4 border-l">
          <ul>
            <li>Record of Landing&nbsp;</li>
            <li>Confirmation of Permanent Residence&nbsp;</li>
            <li>Permanent resident card (front and back)&nbsp;</li>
          </ul>
        </td>
        <td class="col-sm-4 border-l">
          <ul>
            <li>Study permit&nbsp;</li>
            <li>
              Work permit (Working Holiday permit must include a letter of
              employment)&nbsp;
            </li>
            <li>Visitor permit (accompanying spouse or child)&nbsp;</li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.border-tl {
  border-top: 1px solid black;
  border-left: 1px solid black;
  border-bottom: none;
  border-right: none;
}

.border-l {
  border-left: 1px solid black;
  border-top: none;
  border-right: none;
  border-bottom: none;
}

.border-br {
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  border-top: none;
  border-left: none;
}
</style>
