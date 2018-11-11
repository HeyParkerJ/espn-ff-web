import React, { Component } from 'react'
import Requests from './http/requests'
import PowerRankingWeekSelectionComponent from './PowerRankingWeekSelectionComponent'
import PowerRankingsCard from './PowerRankingsCard'
import Grid from '@material-ui/core/Grid'
import AggregatePowerRankingsContainer from './AggregatePowerRankingsContainer'

class ViewPowerRankings extends Component {
  constructor() {
    super()
    this.state = {
      rankingsList: null,
      selectedWeek: null,
      users: null,
      // TODO - make latest
    }
  }

  componentDidMount() {
    Requests.getAllPowerRankings().then(res => {
      let weeks = Object.keys(res).sort()
      this.setState({
          rankingsList: res,
          selectedWeek: weeks[weeks.length-1]
        })
    })

    Requests.getTeams().then(res => {
      console.log(res)
      this.setState({ users: res.data })
    })
  }

  setWeekToDisplay = week => {
    this.setState({ selectedWeek: week })
  }

  renderWeekSelection = () => {
    let weeksWithSubmissions = []


    if(this.state.rankingsList) {
      Object.keys(this.state.rankingsList).forEach((week,index) => {
        weeksWithSubmissions.push(week);
      })
    } else {
      return <p>Placeholder until we get the weeks back</p>
    }

    return <PowerRankingWeekSelectionComponent weeks={weeksWithSubmissions} setWeekToDisplay={this.setWeekToDisplay}/>
  }

  renderSelectedWeek = () => {
    let rankings = []

    if(this.state.selectedWeek && this.state.rankingsList && this.state.users) {
      this.state.rankingsList[this.state.selectedWeek].forEach((ranking) => {
        rankings.push(<PowerRankingsCard key={ranking.teamId} rankings={ranking} users={this.state.users} />)
      })
    }
    return rankings
  }

  renderAggregatePowerRankingsContainer = () => {
    if(this.state.selectedWeek && this.state.rankingsList && this.state.users) {
      return <AggregatePowerRankingsContainer rankings={this.state.rankingsList[this.state.selectedWeek]}/>
    } else {
      return null
    }
  }

  renderRankings = () => {
    let rankingsDiv = []
    if(this.state.rankingsList) {
      this.state.rankingsList.forEach((ranking) => {
        rankingsDiv.push(<PowerRankingsCard key={ ranking.teamId } ranking={ranking}/>)
      })
    } else {
      rankingsDiv.push(<p>Imagine these are the power rankings</p>)
    }
    return rankingsDiv
  }

  render() {
    return (
      <div>
        {this.renderWeekSelection()}
        <Grid
          container
          justify='center'
        >
          {this.renderAggregatePowerRankingsContainer()}
        </Grid>

        <Grid
          container
          direction='row'
          justify='center'
          alignItems='center'
          className='selectedWeekContainer'
          spacing={16}
        >
         {this.renderSelectedWeek()}
        </Grid>
      </div>
    )
  }
}
export default ViewPowerRankings
