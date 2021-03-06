import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withErrorBoundary from '../../hocs/withErrorBoundary';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import getBurndownData from '../../utils/bugzilla/chartJs/getBurndownData';

class BugzillaBurndown extends Component {
    state = {
        data: null,
    };

    async componentDidMount() {
        this.fetchData(this.props);
    }

    async fetchData({ handleError, queries, startDate }) {
        try {
            this.setState(await getBurndownData(queries, startDate));
        } catch (error) {
            handleError(error);
        }
    }

    render() {
        const { data } = this.state;
        const { title } = this.props;

        return data ? (
          <ChartJsWrapper
            data={data}
            options={{ scaleLabel: 'Number of bugs' }}
            title={title}
          />
        ) : <div />;
    }
}

BugzillaBurndown.propTypes = {
    handleError: PropTypes.func.isRequired,
    queries: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        parameters: PropTypes.shape({
            include_fields: PropTypes.string,
            component: PropTypes.string,
            resolution: PropTypes.string,
            priority: PropTypes.arrayOf(PropTypes.string),
        }),
    })),
    startDate: PropTypes.string,
    title: PropTypes.string,
};

export default withErrorBoundary(BugzillaBurndown);
