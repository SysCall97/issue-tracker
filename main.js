document.getElementById('issueInputForm').addEventListener('submit', submitIssue);

function submitIssue(e) {
  const getInputValue = id => document.getElementById(id).value;
  const description = getInputValue('issueDescription');
  const severity = getInputValue('issueSeverity');
  const assignedTo = getInputValue('issueAssignedTo');
  const id = Math.floor(Math.random()*100000000) + '';
  const status = 'Open';

  const issue = { id, description, severity, assignedTo, status };
  let issues = [];
  if (localStorage.getItem('issues')){
    issues = JSON.parse(localStorage.getItem('issues'));
  }
  issues.push(issue);
  localStorage.setItem('issues', JSON.stringify(issues));

  document.getElementById('issueInputForm').reset();
  fetchIssues();
  e.preventDefault();
}

const closeIssue = id => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const currentIssue = issues.find(issue => issue.id === id);
  currentIssue.status = 'Closed';
  localStorage.setItem('issues', JSON.stringify(issues));
  fetchIssues();
}

const deleteIssue = id => {
  id = id.toString();
  const issues = JSON.parse(localStorage.getItem('issues'));
  const remainingIssues = issues.filter( issue => issue.id !== id );
  console.log(remainingIssues);
  localStorage.setItem('issues', JSON.stringify(remainingIssues));

  fetchIssues();
}

const setStatusClosed = (issueId) => {
  const idChild = document.getElementById(issueId);
  const descriptionElement = idChild.nextElementSibling.nextElementSibling;
  const description = descriptionElement.innerText;
  idChild.nextElementSibling.innerHTML = `<span class="label label-danger"> Closed </span>`;
  descriptionElement.innerHTML = `<del>${description}</del>`;

  const issues = JSON.parse(localStorage.getItem('issues'));
  let active = 0; 
  
  for(let i = 0; i < issues.length; ++i) {
    if(issues[i].id === issueId) {
      issues[i].status = "Closed";
    }
    if(issues[i].status === "Open") ++active;
  }
  setActiveTotalIssues(issues, issues.length, active);
  localStorage.setItem('issues', JSON.stringify(issues));
}

const fetchIssues = () => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const issuesList = document.getElementById('issuesList');
  let active = 0;
  issuesList.innerHTML = '';


  for (var i = 0; i < issues.length; i++) {
    const {id, description, severity, assignedTo, status} = issues[i];

    if(status === "Open") {
      ++active;
      issuesList.innerHTML +=   `<div class="well">
                              <h6 id="${id}">Issue ID: ${id} </h6>
                              <p><span class="label label-info"> ${status} </span></p>
                              <h3> ${description} </h3>
                              <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                              <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
                              <a href="#" onclick="setStatusClosed('${id}')" class="btn btn-warning">Close</a>
                              <a href="#" onclick="deleteIssue(${id})" class="btn btn-danger">Delete</a>
                              </div>`;
    } else {
      issuesList.innerHTML +=   `<div class="well">
                              <h6 id="${id}">Issue ID: ${id} </h6>
                              <p><span class="label label-danger"> ${status} </span></p>
                              <h3> <del>${description}</del> </h3>
                              <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                              <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
                              <a href="#" onclick="setStatusClosed(${id})" class="btn btn-warning">Close</a>
                              <a href="#" onclick="deleteIssue(${id})" class="btn btn-danger">Delete</a>
                              </div>`;
    }
  }

  setActiveTotalIssues(issues, issues.length, active);
}

function setActiveTotalIssues (issues, total, active) {
  console.log(issues);
  const element = document.querySelector('.jumbotron').previousElementSibling;
  element.innerHTML = "Issue Tracker: "
  const totalIssues = `<span>(${total})</span>`;
  const activeIssues = `<span>${active}</span>`;
  element.innerHTML += activeIssues + totalIssues;
}