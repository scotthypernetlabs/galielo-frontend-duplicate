import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Box, Paper, IconButton, Link } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

interface DependencyProps {
    item: any
    onDelete:any
    updateDependency: any
  }

const Dependency: React.SFC<DependencyProps> = ( props: DependencyProps) => {
    const { item, onDelete, updateDependency} = props;
    console.log('item in dependency', item)
    const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
    const updateVesion = ()=> {
        item.version = "v.1.2"
    }
  return (
      <>
    <Box display= "flex" className = "dependency">
    <Box flexGrow={1}>
        <Typography className={classes.title} variant="body2" component="p">
            {item.name}  <span >({item.version})</span>
          </Typography>
          <Link  onClick={()=>updateDependency(item.name)} variant="caption">
            Change Version
          </Link>
          </Box>
          <Box>
        <IconButton  
            edge = "end"
            size = "small"
            onClick={onDelete} 
            aria-label="delete dependency" 
            component="span">
          <ClearIcon />
        </IconButton>
        </Box>
    </Box>
    </>
  );
}
export default Dependency;