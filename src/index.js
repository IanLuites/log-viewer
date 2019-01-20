// React
import React from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import distinctColors from 'distinct-colors';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';

const styles = _theme => (
  {
    viewer: {
      '&::-webkit-scrollbar': {
        width: '0.4em'
      },
      '&::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        outline: '1px solid slategrey'
      },
      backgroundColor: '#000'
    },
    entry: {
      '& pre': {
        color: '#fff',
        marginTop: '2px',
        fontSize: '16px'
      },
      '&>span': {
        fontSize: '16px',
        verticalAlign: 'top'
      }

    }
  });

const highlightPattern = (text, pattern) => {
  const splitText = text.split(pattern);

  if (splitText.length <= 1) {
    return text;
  }

  const matches = text.match(pattern);

  return splitText.reduce((arr, element, index) => (matches[index] ? [
    ...arr,
    element,
    <mark key={index}>
      {matches[index]}
    </mark>
  ] : [...arr, element]), []);
};

const filterLogs = (logs, filter, filter_r, labels) => logs
  .filter(({ log }) => filter === '' || filter_r.test(log))
  .filter(({ labels: l }) => Object.keys(l).map(k => labels[k].indexOf(l[k]) > -1).reduce((a, b) => a && b, true));

const labelSelect = (self, label, values, selected) => {
  return <FormControl
    key={label}
    variant="filled">
    <InputLabel
      variant="filled" htmlFor={`filter-${label}`}>{label}</InputLabel>
    <Select
      variant="filled"
      multiple
      value={selected}
      onChange={e => {
        const sel = self.state.selected;

        sel[label] = e.target.value;
        self.setState({ selected: sel, logs: filterLogs(self.props.logs, self.state.filter, sel) });
      }}
      input={<Input id={`filter-${label}`} />}
      renderValue={s => s.length == selected.length ? 'All' : `${s.length} ${label}s`}
    >
      {values.map(v => (
        <MenuItem key={v} value={v}>
          <Checkbox checked={selected.indexOf(v) > -1} />
          <ListItemText primary={v} style={{ color: self.colors[label][v] }} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>;
};

const createFilter = string => {
  try {
    return new RegExp(string);
  } catch (_e) {
    return new RegExp(string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  }
};

class LogView extends React.Component {
  static propTypes = {
    height: PropTypes.string.isRequired,
    width: PropTypes.string,
    logs: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.shape({
      entry: PropTypes.string.isRequired,
      viewer: PropTypes.string.isRequired
    })
  };

  constructor(props) {
    super(props);

    let labels = {};

    props.logs.map(({ labels: l }) => {
      Object.keys(l).map(key => {
        const v = l[key];
        let values = labels[key] || [v];

        if (!values.includes(v)) {
          values.push(v);
        }

        labels[key] = values;
      });
    }, {});

    this.labels = labels;

    const colors = {};

    for (const k in labels) {
      const c = {};
      const lc = labels[k];
      const cs = distinctColors({
        count: lc.length,
        chromaMin: 30,
        chromaMax: 80,
        lightMin: 35,
        lightMax: 80
      });

      for (const l in lc) {
        c[lc[l]] = cs[l];
      }

      colors[k] = c;
    }

    this.state = {
      filter: '',
      filter_r: false,
      selected: JSON.parse(JSON.stringify(labels)),
      logs: this.props.logs
    };

    this.colors = colors;

    this.cache = new CellMeasurerCache({
      defaultHeight: 35,
      fixedWidth: true
    });
  }

  renderRow({ index, key, parent, style }) {
    const log = this.state.logs[index];

    if (log) {
      return <CellMeasurer
        cache={this.cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div style={style} className={this.props.classes.entry}>
          <span style={{ color: this.colors['pod'][log.labels['pod']] }}>{log.labels['pod']}: </span>
          <pre style={{ display: 'inline-block' }}>
            {highlightPattern(log.log, this.state.filter_r)}
          </pre>
        </div>
      </CellMeasurer >;
    }
  }

  render() {
    return <>
      <div>
        <TextField
          label="Filter"
          variant="filled"
          value={this.state.filter}
          onChange={e => {
            const filter = e.target.value;
            const filter_r = createFilter(e.target.value);
            const logs = filterLogs(this.props.logs, filter, filter_r, this.state.selected);

            this.setState({ filter: e.target.value, filter_r: filter_r, logs: logs });
          }}
        />
        {
          Object
            .keys(this.labels)
            .filter(l => this.labels[l].length > 1)
            .map(l => labelSelect(this, l, this.labels[l], this.state.selected[l]))
        }
      </div>
      <Paper style={{ height: this.props.height, width: this.props.width || '100%' }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              className={this.props.classes.viewer}
              height={height}
              width={width}
              rowCount={this.state.logs.length}
              deferredMeasurementCache={this.cache}
              rowHeight={this.cache.rowHeight}
              rowRenderer={index => this.renderRow(index)}
            />
          )}
        </AutoSizer>
      </Paper>
    </>;
  }
}

export default withStyles(styles)(LogView);
