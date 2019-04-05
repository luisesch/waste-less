import React, { Component } from "react";
import { withRouter } from "react-router";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import Moment from "moment";

class Carouseltasks extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      index: 0,
      direction: null
    };
  }

  handleSelect(selectedIndex, e) {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    });
  }

  render() {
    if (this.props.tasks.length <= 0) {
      return (
        <p>
          No completed tasks yet. Get started!
          <br />
          <Link
            to="/tasks"
            style={{ textDecoration: "underline", color: "#1b2f33" }}
          >
            Browse tasks
          </Link>
        </p>
      );
    } else {
      const { index, direction } = this.state;
      return (
        <Carousel
          activeIndex={index}
          direction={direction}
          onSelect={this.handleSelect}
        >
          {this.props.tasks.map((task, index) => {
            if (index <= 10) {
              return (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100 img-fluid"
                    src={task.task.photo}
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <div className="blue transparent noborder pt-1 pb-1">
                      <p>
                        <strong>{task.user.username}</strong> collected <br />
                        <strong>{task.task.points}</strong> points for task:
                        <br />
                        {task.task.description}
                      </p>
                      <small>
                        {Moment(task.created_at)
                          .startOf("minute")
                          .fromNow()}
                      </small>
                    </div>
                  </Carousel.Caption>
                </Carousel.Item>
              );
            } else {
              return null;
            }
          })}
        </Carousel>
      );
    }
  }
}

export default withRouter(Carouseltasks);
