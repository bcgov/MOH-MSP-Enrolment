<template>
  <table class="table table-sm">
    <thead>
      <tr class="border-br row bg-primary text-light text-center">
        <th class="col-sm-4 border-tl">Canadian Citizen</th>
        <th class="col-sm-4 border-tl">Permanent Resident</th>
        <th class="col-sm-4 border-tl">Temporary Document Holder</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-br row">
        <td class="col-sm-4 border-l">
          <ul>
            <li>Canadian birth certificate</li>
            <li>Canadian citizenship card (front and back)</li>
            <li>Certificate of Canadian citizenship (front and back)</li>
            <li>Canadian passport</li>
            <li>First Nations status card</li>
            <li>Métis status card</li>
          </ul>
        </td>
        <td class="col-sm-4 border-l">
          <ul>
            <li>Record of Landing</li>
            <li>Confirmation of Permanent Residence</li>
            <li>Permanent Resident card (front and back)</li>
          </ul>
        </td>
        <td class="col-sm-4 border-l">
          <ul>
            <li>Study permit</li>
            <li>Work permit (working holiday permit holders must include a letter of employment)</li>
            <li>Visitor permit (accompanying spouse or child)</li>
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