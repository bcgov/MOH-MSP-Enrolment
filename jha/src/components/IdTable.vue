<template>
  <table class="table table-bordered table-sm">
    <thead>
      <tr class="bg-primary text-light">
        <th scope="col">Canadian Citizen</th>
        <th scope="col">Permanent Resident</th>
        <th scope="col">Temporary Document Holder</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <ul>
            <li>Canadian Birth Certificate</li>
            <li>Canadian Citizenship Card (front and back)</li>
            <li>Certificate of Canadian citizenship (front and back)</li>
            <li>Canadian Passport</li>
            <li>First Nations status card</li>
            <li>Métis status card</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Record of Landing</li>
            <li>Confirmation of Permanent Residence</li>
            <li>Permanent Resident Card (front and back)</li>
          </ul>
        </td>
        <td>
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
table.table-bordered {
  border: 1px solid black;
}

table.table-bordered>thead>tr>th {
  border: 1px solid black;
}

table.table-bordered>tbody>tr>td {
  border: 1px solid black;
}
</style>